import { users } from "../dummmyData/data.js";

export const userResolver = {
  Query: {
    users: () => {
      return users;
    },
  },
  Mutation: {},
};
