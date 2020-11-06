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
  // 1) get data of the requested tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    res.status(404).render('error', {
      title: '404 Not Found',
    });
    return;
  }

  // 3) render template with data from 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: tour,
  });
});
