const Match = require('../../models/match');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const matches = async matchIds => {
  try {
    const matches = await Match.find({ _id: { $in: matchIds } });
    matches.map(match => {
      return transformMatch(match);
    });
    return matches;
  } catch (err) {
    throw err;
  }
};

const singleMatch = async matchId => {
  try {
    const match = await Match.findById(matchId);
    return transformMatch(match);
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

const transformMatch = match => {
  return {
    ...match._doc,
    _id: match.id,
    date: dateToString(match._doc.date),
    creator: user.bind(this, match.creator)
  };
};

const transformBooking = booking => {
  return { 
    ...booking._doc, 
    _id: booking.id, 
    user: user.bind(this, booking._doc.user),
    match: singleMatch.bind(this, booking._doc.match),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
}

exports.transformMatch = transformMatch;
exports.transformBooking = transformBooking;