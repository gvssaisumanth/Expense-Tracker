import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import passport from "passport";
import session from "express-session";
import connectMongo, { MongoDBStore } from "connect-mongodb-session";
import { buildContext } from "graphql-passport";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { meregedResolvers } from "./resolvers/index.js";
import { mergedTypeDefs } from "./typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();

const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log(err));

/**
 * Mounting a session Middle ware
 * @param resave : This option specifies whether to save the session to the store on every request
 * @param saveUninitialized: Option specifies whether to save uninitialized sessions
 * @param Cookie.httpOnly: this option prevents the Cross-Site Scripting (XSS) attacks
 */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: store,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: meregedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

/**
 * expressMiddleware accepts the same arguments:
 * An Apollo Server instance and optional configuration options
 * @param expressMiddleWare.context : It is used as an argument by the resolvers (as 3rd Argument)
 */
app.use(
  "/",
  cors({
    origin: process.env.REACT_URL,
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/`);
