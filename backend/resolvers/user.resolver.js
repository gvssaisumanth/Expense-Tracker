import { use } from "passport";
import { users } from "../dummmyData/data.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("User Already exists");
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? maleProfilePic : femaleProfilePic,
        });

        await newUser.save();
        /**
         * Refer  https://www.npmjs.com/package/graphql-passport
         */
        await context.login(newUser);

        return newUser;
      } catch (err) {
        console.log("internal sever error");
        throw new Error(err.message || "Internal Server Error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", { username, password });

        await context.login(user);

        return user;
      } catch (err) {
        console.error("error while logging in");
        throw new Error(err.message || "Internal Server Error");
      }
    },
    logout: async (_, _, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (err) {
        console.error("error while logging out");
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
  Query: {
    authUser: async (_, _, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in auth");
        throw new Error(err.message || "Internal Server Error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in auth");
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
};
