import { users } from "../dummmyData/data.js";

export const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    user: (_, { userId }) => {
      return users.find((user) => user._id === userId);
    },
  },
  Mutation: {},
};
