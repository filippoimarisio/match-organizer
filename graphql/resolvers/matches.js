const Match = require('../../models/match');
const User = require('../../models/user');

const { transformMatch } = require('./merge');

module.exports = {
  matches: async () => {
    try {
      const matches = await Match.find();
      return matches.map(match => {
        return transformMatch(match);
      });
    } catch (err) {
      throw err;
    }
  },
  createMatch: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('You must be logged in to create a match');
    }
    console.log('richiesta', req)
    const match = new Match({
      title: args.matchInput.title,
      description: args.matchInput.description,
      price: +args.matchInput.price,
      date: new Date(args.matchInput.date),
      creator: req.userId
    });
    let createdMatch;
    try {
      const result = await match.save();
      createdMatch = transformMatch(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdMatches.push(match);
      await creator.save();

      return createdMatch;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};