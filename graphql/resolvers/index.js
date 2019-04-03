const bcrypt = require('bcryptjs');

const Match = require('../../models/match');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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

const singleMatch = async matchId => {
  try {
    const match = await Match.findById(matchId);
    return {
      ...match._doc,
      _id: match.id,
      creator: user.bind(this, match.creator)
    }
  }
  catch (err) {
    throw err
  }
}

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
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return { 
          ...booking._doc, 
          _id: booking.id, 
          user: user.bind(this, booking._doc.user),
          match: singleMatch.bind(this, booking._doc.match),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        }
      })
    } catch (err) {
      throw err
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
  },
  bookMatch: async args => {
    const fetchedMatch = await Match.findOne({_id: args.matchId});
    const booking = new Booking({
      user: '5c0fbd06c816781c518e4f3e',
      match: fetchedMatch
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking._doc.match),
      match: singleMatch.bind(this, booking._doc.user),
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString()
    };
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById({_id: args.bookingId}).populate('match');
      console.log("The booking", booking)
      const match = {
        ...booking.match._doc,
        _id: booking.match.id,
        creator: user.bind(this, booking.match._doc.creator)
      };
      await Booking.deleteOne({_id: args.bookingId})
      return match;
    } catch (err) {
      throw err
    }
  }
};