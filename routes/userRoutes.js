//
//	ROUTER FOR USERS
//

//THIRD PARTY MODULES
const router = require('express').Router();

//PERSONAL MODULES
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/logout', authController.logout);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// protect all routes after this middleware
router.use(authController.protect);

router.patch('/update-my-password', authController.updatePassword);

router
  .route('/me')
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
