const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync.wrapper');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 3) Render the template using data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  console.log(req.params.slug);
  // 1) get data of the requested tour
  const tour = await Tour.findOne({ slug: req.params.slug });

  // 3) render template with data from 1
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour,
  });
});
