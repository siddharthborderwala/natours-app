const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/APIFeatures.class');
const AppError = require('../utils/AppError.class');
const catchAsync = require('../utils/catchAsync.wrapper');
const filterObject = require('../utils/filterObject');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(
    filterObject(req.body, 'review', 'rating', 'tour', 'user')
  );

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = Review.findById(req.params.id);

  if (!review) return next(new AppError('Review not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    filterObject(req.body, 'review', 'rating'),
    {
      new: true,
      runValidators: true,
    }
  );

  if (!review) return next(new AppError('Review not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const data = Review.findByIdAndDelete(req.params.id);

  if (!data) return next(new AppError('Review not found', 404));

  res.status(204).json({
    status: 'success',
    data,
  });
});
