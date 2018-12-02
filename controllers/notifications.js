let Notifications = require('../model/notifications');

let functions = {
  list: function (req, res) {

    Notifications.find(
      {user: req.body.user}
    ).sort({added_date: -1})
      .exec(function (error, docs) {

        if (error) return res.status(500).send({success: false, msg: error});
        res.json({success: true, msg: docs});
      });
  },

  unreadCount: function (req, res) {

    Notifications.count(
      {user: req.body.user, status: 0}
    ).exec(function (error, docs) {

      if (error) return res.status(500).send({success: false, msg: error});
      res.json({success: true, msg: docs});
    });
  },

  read: function (req, res) {
    Notifications.findByIdAndUpdate(req.body.id, {status: 1}, function (error, doc) {
      if (error) return res.status(500).send({success: false, msg: error});
      res.json({success: true, msg: null});
    });
  }
};

module.exports = functions;
