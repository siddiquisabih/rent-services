let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookingSchema = new Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  car_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  from: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    required: true
  },
  booking_date: {
    type: Date,
    required: true
  },
  noOfDays: {
    type: Number,
    required: true
  },
  driverPrice: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
  },
  /**
   * 0: New Booking
   * 1: Booking Accepted/Started
   * 2: Booking Completed
   * 3: Booking Cancel
   */
  status: {
    default: 0, // New Booking
    type: Number,
    required: false,
  },
  added_date: {
    type: Date,
    default: Date.now
  },
});

bookingSchema.index({ user: 1, car_owner: 1, status: 1 });
module.exports = mongoose.model('Booking', bookingSchema);
