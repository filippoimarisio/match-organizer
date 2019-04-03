const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    match: {
      type: Schema.Types.ObjectId,
      ref: 'Match'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('Booking', bookingSchema);