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
// TODO: implement reset password
// access resetToken from url params on frontEnd
router.get('/forgot-password', notImplementedRoute);

module.exports = router;
