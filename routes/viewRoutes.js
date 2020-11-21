const router = require('express').Router();

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const { notImplementedRoute } = require('../utils/notImplementedRoute');

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// TODO: implement signup
router.get('/signup', notImplementedRoute);

router.route('/me').all(authController.protect).get(viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
// TODO: implement reset password
// send req from login form, receive email, open this rote
// access resetToken from url params on frontEnd
router.get('/forgot-password', notImplementedRoute);

// TODO: implement checkout success page
// access resetToken from url params on frontEnd
router.get('/checkout/success', notImplementedRoute);

module.exports = router;
