const Match = require('../../models/match');
const Booking = require('../../models/booking');
const { transformMatch, transformBooking } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('You must be logged in to see the bookings for this event');
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      })
    } catch (err) {
      throw err
    }
  },
  bookMatch: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('You must be logged in to book a match');
    }
    const fetchedMatch = await Match.findOne({_id: args.matchId});
    const booking = new Booking({
      user: req.userId,
      match: fetchedMatch
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async args => {
    if (!req.isAuth) {
      throw new Error('You must be logged in to cancel a booking');
    }
    try {
      const booking = await Booking.findById({_id: args.bookingId}).populate('match');
      const match = transformMatch(booking.match);
      await Booking.deleteOne({_id: args.bookingId})
      return match;
    } catch (err) {
      throw err
    }
  }
};