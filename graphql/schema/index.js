const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Match {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdMatches: [Match!]
  }

  input MatchInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    matches: [Match!]!
  }

  type RootMutation {
    createMatch(matchInput: MatchInput): Match
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)