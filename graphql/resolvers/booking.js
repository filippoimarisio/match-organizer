const Match = require('../../models/match');
const Booking = require('../../models/booking');
const { transformMatch, transformBooking } = require('./merge');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      })
    } catch (err) {
      throw err
    }
  },
  bookMatch: async args => {
    const fetchedMatch = await Match.findOne({_id: args.matchId});
    const booking = new Booking({
      user: '5c0fbd06c816781c518e4f3e',
      match: fetchedMatch
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async args => {
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