const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Match = require('./models/match');

const app = express();

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
      return Match.find()
      .then(matches => {
        return matches.map(match => {
          return { ...match._doc, _id: match.id };
        })
      })
      .catch(err => {
        throw err;
      })
    },
    createMatch: (args) => {
      const match = new Match({
        title: args.matchInput.title,
        description: args.matchInput.description,
        price: +args.matchInput.price,
        date: new Date (args.matchInput.date)
      })
      return match
        .save()
        .then(result => {
          console.log(result);
          return {...result._doc};
        })
        .catch(err => {
          console.log(err);
          throw err;
      });
      return match;
    }
  },
  graphiql: true
}));
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-ahokq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })

