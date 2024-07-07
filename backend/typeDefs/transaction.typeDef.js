export const transactionTypeDef = `#graphql

type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
}

type Query {
    transactions: [Transaction!]
    transaction(transactionId:ID!): Transaction
}

type Mutation {
    createTransaction(input: CreatetransactionInput): Transaction!
    updateTransaction(input: UpdateTransactionInput): Transaction!
    deleteTransaction(transactionId: ID!): Transaction!

}

input CreatetransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    date: String!
    location: String
}

input UpdateTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    date: String!
    location: String
}
`;
