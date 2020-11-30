const router = require('express').Router();

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.get('/forgot-password', viewsController.getForgotPassword);
router.get('/reset-password', viewsController.getResetPassword);
router.get('/checkout', viewsController.getCheckout);

module.exports = router;
