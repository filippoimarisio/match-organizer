const bcrypt = require('bcryptjs');

const Match = require('../../models/match');
const User = require('../../models/user');

const matches = async matchIds => {
  try {
    const matches = await Match.find({ _id: { $in: matchIds } });
    matches.map(match => {
      return {
        ...match._doc,
        _id: match.id,
        date: new Date(match._doc.date).toISOString(),
        creator: user.bind(this, match.creator)
      };
    });
    return matches;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdMatches: matches.bind(this, user._doc.createdMatches)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  matches: async () => {
    try {
      const matches = await Match.find();
      return matches.map(match => {
        return {
          ...match._doc,
          _id: match.id,
          date: new Date(match._doc.date).toISOString(),
          creator: user.bind(this, match._doc.creator)
        };
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
      creator: '5c0fbd06c816781c518e4f3e'
    });
    let createdMatch;
    try {
      const result = await match.save();
      createdMatch = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(match._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById('5c0fbd06c816781c518e4f3e');

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
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};