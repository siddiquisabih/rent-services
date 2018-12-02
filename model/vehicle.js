let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let vehicleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  make: {
    type: Number,
    required: false
  },
  plate: {
    type: String,
    required: true
  },
  city_price: {
    type: Number,
    required: false
  },
  other_price: {
    type: Number,
    required: false
  },
  driver_price: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  /**
   * 0: No Booking
   * 1: Booking Accepted/Started
   * 2: Booking Completed
   * 3: Booking Cancel
   */
  status: {
    default: 0, // No Booking
    type: Number,
    required: false,
  },
  added_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
