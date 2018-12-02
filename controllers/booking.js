let config = require('../config/database');
let jwt = require('jwt-simple');
let Booking = require('../model/bookings');
let Vehicle = require('../model/vehicle');
let Notifications = require('../model/notifications');

let functions = {
  addNew: function (req, res) {

    let loginUser = getinfo(req);

    let o = {...req.body, ...{user: loginUser._id}};
    let newBooking = new Booking(o);

    newBooking.validate(function (err) {
      if (err)
        return res.status(400).send({success: false, msg: err});
      else {
        newBooking.save(function (err, book) {
          if (err) {
            return res.status(500).send({success: false, msg: 'Failed to save booking'})
          }
          else {

            Vehicle.findByIdAndUpdate(req.body.car, {status: 0}, function (error, doc) {
              if (error) console.log(error);
            });

            const notification = new Notifications({
              user: req.body.car_owner,
              booking: book._id,
              message: "New booking received.",
            });
            notification.save().then(() => console.log('notifications saved'));

            res.json({success: true, msg: 'Successfully booking saved'});
          }
        })
      }
    });
  },

  get: function (req, res) {
    Booking.find({
      _id: req.body.Id
    }).populate({
      path: 'car car_owner user',
      select: 'name type model make plate company phone city address description image',
    }).exec(function (error, docs) {

      if (error) return res.status(500).send({success: false, msg: error});
      res.json({success: true, msg: docs[0]});
    })
  },

  status: function (req, res) {

    Booking.findByIdAndUpdate(req.body.Id, {status: req.body.status, discount: req.body.discount}, (err, result) => {
      if (err) return res.status(500).send({success: false, msg: 'Booking Not found!'});

      Vehicle.findByIdAndUpdate(req.body.car, {status: req.body.status}, function (error, doc) {
        if (error) console.log(error);
      });

      const status = {0: 'Pending', 1: 'Started', 2: 'Completed', 3: 'Cancel'};

      const notification = new Notifications({
        user: result.user,
        booking: req.body.Id,
        message: "Booking status: " + status[req.body.status],
      });
      notification.save().then(() => console.log('notifications saved'));

      res.json({success: true, msg: 'Booking Status Changed'});
    });
  },

  del: function (req, res) {

    Booking.findByIdAndRemove(req.body.Id, (err, result) => {
      if (err) return res.status(500).send({success: false, msg: 'Booking Not found!'});
      res.json({success: true, msg: 'Booking successfully deleted'});
    });
  },

  list: function (req, res) {

    let loginUser = getinfo(req);
    let query = {};

    if (req.body.admin) {
      query = {car_owner: loginUser._id}
    } else {
      query = {user: loginUser._id};
    }

    Booking.find(
      query
    ).populate({
      path: 'car',
    }).sort({added_date: -1})
      .exec(function (error, docs) {

        if (error) return res.status(500).send({success: false, msg: error});
        res.json({success: true, msg: docs});
      });
  },
};

let getinfo = function (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    let token = req.headers.authorization.split(' ')[1];
    return jwt.decode(token, config.secret);
  }
  else {
    return null;
  }
};

module.exports = functions;
