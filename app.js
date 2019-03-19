const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Match = require('./models/match');
const User = require('./models/user');

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

    type User {
      _id: ID!
      email: String!
      password: String
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
        date: new Date (args.matchInput.date),
        creator: '5c91405d73a94b46cb9141c9'
      });
      let createdMatch;
      return match
        .save()
        .then(result => {
          createdMatch = {...result._doc, _id: result.id };
          return User.findById('5c91405d73a94b46cb9141c9');
        })
        .then(user => {
          if(!user) {
            throw new Error('User not found.')
          }
          user.createdMatches.push(match);
          return user.save();
        })
        .then(result => {
          return createdMatch;
        })
        .catch(err => {
          console.log(err);
          throw err;
      });
      return match;
    },
    createUser: args => {
      return User.findOne({email: args.userInput.email})
        .then(user => {
          if(user) {
            throw new Error('User already exits.')
          }
          return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          
          return user.save();
        })
        .then(result => {
          return { ...result._doc, password:null, _id: result.id };
        })
        .catch(err => {
          throw err;
        });
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

