let config = require('../config/database');
let jwt = require('jwt-simple');
let Vehicle = require('../model/vehicle');

let functions = {
  addNew: function (req, res) {

    let loginUser = getinfo(req);
    if (!req.body._id) {
      delete req.body._id;
    }
    let o = {...req.body, ...{by: loginUser._id}};
    let newVehicle = new Vehicle(o);

    newVehicle.validate(function (err) {
      if (err)
        return res.status(400).send({success: false, msg: err});
      else {

        if (req.body._id) {
          Vehicle.findOneAndUpdate({_id: req.body._id}, o, function (err, user) {
            if (err) {
              return res.status(500).send({success: false, msg: err + ' Failed to update'})
            }
            else {
              res.json({success: true, msg: 'Successfully updated'});
            }
          })
        } else {
          newVehicle.save(function (err, user) {
            if (err) {
              return res.status(500).send({success: false, msg: 'Failed to save'})
            }
            else {
              res.json({success: true, msg: 'Successfully saved'});
            }
          })
        }
      }
    });

  },

  get: function (req, res) {
    Vehicle.find({
      _id: req.body.Id
    }).populate({
      path: 'by',
      select: 'city company address phone',
    }).exec(function (error, docs) {

      if (error) return res.status(500).send({success: false, msg: error});
      res.json({success: true, msg: docs[0]});
    })
  },

  del: function (req, res) {

    Vehicle.findByIdAndRemove(req.body.Id, (err, result) => {
      if (err) return res.status(500).send({success: false, msg: 'Vehicle Not found!'});
      res.json({success: true, msg: 'Vehicle successfully deleted'});
    });
  },

  list: function (req, res) {

    let loginUser = getinfo(req);
    Vehicle.find({by: loginUser._id})
      .exec(function (error, result) {
        res.json({success: true, msg: result});
      })
  },

  search: function (req, res) {

    let q = {status: { $in: [0, 2, 3] }};
    if (req.body.type && req.body.type !== '') {
      q = {type: req.body.type, status: { $in: [2, 3] }};
    }

    Vehicle.find({} , (error , found)=>{

      if(found){
        res.json({success : true , result : found})
      }
    })
    // Vehicle.find(
    //   q,
    //   {
    //     _id: true,
    //     name: true,
    //     make: true,
    //     model: true,
    //     image: true,
    //     other_price: true,
    //     city_price: true,
    //     driver_price: true,
    //     description: true,
    //   }
    // ).populate({
    //   path: 'by',
    //   match: {$text: {$search: req.body.type}},
    //   select: 'city company',
    // })
    //   .exec(function (error, docs) {

    //     if (error) return res.status(500).send({success: false, msg: error});

    //     docs = docs.filter(function (doc) {
    //       return !!doc.by;
    //     });

    //     res.json({success: true, msg: docs});
    //   })
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
