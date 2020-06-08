//
//	ROUTER FOR TOURS
//

//THIRD PARTY MODULES
const express = require('express');

//PERSONAL MODULES
const tourController = require('./../controllers/tourController');

const tourRouter = express.Router();

tourRouter.param('id', tourController.checkId);

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = tourRouter;
