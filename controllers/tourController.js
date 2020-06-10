//
//	CONTROLLER FOR TOURS
//

//CORE MODULES
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!',
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const data = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data,
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};

/*
CUSTOM MIDDLEWARES

exports.checkId = (req, res, next, val) => {
    const id = parseInt(req.params.id, 10);
    if (id < 0 || id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (!(req.body.name || req.body.price)) {
        res.status(400).json({
            status: 'fail',
            message: 'Creating a tour requires a name and a price for the tour',
        });
    }
    next();
};
*/
