import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { meregedResolvers } from "./resolvers/index.js";
import { mergedTypeDefs } from "./typeDefs/index.js";

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: meregedResolvers,
});

const { url } = await startStandaloneServer(server);

console.log(`Server is up and Running at ${url}`);
