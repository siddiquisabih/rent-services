let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let notificationsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    default: 0,
    type: Number,
    required: false,
  },
  added_date: {
    type: Date,
    default: Date.now
  },
});

notificationsSchema.index({user: 1});
module.exports = mongoose.model('Notification', notificationsSchema);
