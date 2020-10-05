//
//	ROUTER FOR TOURS
//

//THIRD PARTY MODULES
const express = require('express');

//PERSONAL MODULES
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const tourRouter = express.Router();

tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTop5Cheap, tourController.getAllTours);

tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = tourRouter;
