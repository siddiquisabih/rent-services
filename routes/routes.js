let express = require('express');
let userController = require('../controllers/user');
let vehicleController = require('../controllers/vehicle');
let bookingController = require('../controllers/booking');
let notificationsController = require('../controllers/notifications');
let passport = require('passport');
let UPLOAD_PATH = 'uploads';

let router = express.Router();
let requireAuth = passport.authenticate('jwt', {session: false});

/**
 * Users
 */
router.post('/authenticate', userController.authenticate);
router.post('/adduser', userController.addNew);
router.post('/getuser', requireAuth, userController.getUser);
router.post('/updateuser', requireAuth, userController.updateUser);

/**
 * Vehicles
 */
router.post('/addvehicle', requireAuth, vehicleController.addNew);
router.get('/vehicleslist', requireAuth, vehicleController.list);
router.post('/getvehicle', requireAuth, vehicleController.get);
router.post('/deletevehicle', requireAuth, vehicleController.del);
router.post('/getresults', requireAuth, vehicleController.search);

/**
 * Bookings
 */
router.post('/newbooking', requireAuth, bookingController.addNew);
router.post('/deletebooking', requireAuth, bookingController.del);
router.post('/getbooking', requireAuth, bookingController.get);
router.post('/bookinglist', requireAuth, bookingController.list);
router.post('/bookingstatus', requireAuth, bookingController.status);

/**
 * Notifications
 */
router.post('/notificationslist', requireAuth, notificationsController.list);
router.post('/notificationscount', requireAuth, notificationsController.unreadCount);
router.post('/readnotification', requireAuth, notificationsController.read);

/**
 * Check protected
 */
router.get('/protected', requireAuth, function (req, res) {
  res.send({success: true});
});

module.exports = router;

