const Match = require('../../models/match');
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
  createMatch: async args => {
    const match = new Match({
      title: args.matchInput.title,
      description: args.matchInput.description,
      price: +args.matchInput.price,
      date: new Date(args.matchInput.date),
      creator: '5c91405d73a94b46cb9141c9'
    });
    let createdMatch;
    try {
      const result = await match.save();
      createdMatch = transformMatch(result);
      const creator = await User.findById('5c91405d73a94b46cb9141c9');

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