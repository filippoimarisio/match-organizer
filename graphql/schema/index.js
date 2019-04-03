const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type Booking {
    _id: ID!
    match: Match!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

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

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createMatch(matchInput: MatchInput): Match
    createUser(userInput: UserInput): User
    bookMatch(matchId: ID!): Booking!
    cancelBooking(bookingId: ID!): Match!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)