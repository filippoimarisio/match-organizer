const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const matches = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`

    type Match {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input MatchInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      matches: [Match!]!
    }

    type RootMutation {
      createMatch(matchInput: MatchInput): Match
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    matches: () => {
      return matches;
    },
    createMatch: (args) => {
      const match = {
        _id: Math.random().toString(),
        title: args.matchInput.title,
        description: args.matchInput.description,
        price: +args.matchInput.price,
        date: args.matchInput.date
      };
      matches.push(match);
      return match;
    }
  },
  graphiql: true
}));

app.listen(3000);