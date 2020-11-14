const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const AppError = require('../utils/AppError.class');
const catchAsync = require('../utils/catchAsync.wrapper');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'wallet'],
    success_url: `${process.env.URL}/checkout/success`,
    cancel_url: `${process.env.URL}/tour/${tour.slug}/`,
    customer_email: `${req.user.email}`,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`${process.env.URL}img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) send it to the user
  res.status(200).json({
    status: 'success',
    session,
  });
});
