import Transaction from "../models/transaction.model.js";

export const transactionResolver = {
  Query: {
    transactions: async (_, _, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transaction = await Transaction.find({ userId });
        return transaction;
      } catch (err) {
        console.err("Error getting transactions", err);
        throw new Error("Error while retreving transactions");
      }
    },

    transaction: async (_, { transactionId }, context) => {
      try {
        const transaction = await Transaction.findById({ transactionId });
        return transaction;
      } catch (err) {
        console.err(`Error while retreving transaction with id ${transactionId}`);
        throw new Error("Error while retrving transaction");
      }
    },
  },
  Mutation: {
    /**
     *
     * @param {parent} _
     * @param {input} you can refer transactiontypeDef Mutation for the function definition
     * @type {input} => CreateTransactionInput refer resolvertypeDef
     * @param {*} context
     */
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({ ...input, userId: context.getUser()._id });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.err("Error whille creating a transaction");
        throw new Error("Error while creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
          new: true,
        });
        return updatedTransaction;
      } catch (err) {
        console.err("Error while updating transaction");
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndDelete(input.transactionId, input, {
          new: true,
        });
        return updatedTransaction;
      } catch (err) {
        console.err("Error while updating transaction");
        throw new Error("Error updating transaction");
      }
    },
  },
};
