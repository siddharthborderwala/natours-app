const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync.wrapper');
const factory = require('./handlerFactory');
const AppError = require('../utils/AppError.class');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) return next(new AppError('No tour with the specified id', 404));

  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${process.env.URL}checkout?success=true&tourSlug=${tour.slug}`,
    cancel_url: `${process.env.URL}checkout?success=false&tourSlug=${tour.slug}`,
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

  if (!session)
    return next(
      new AppError('Could not process payment, please try again', 400)
    );

  // 3) send it to the user
  res.status(200).json({
    status: 'success',
    session,
  });
});
/*
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!(tour && user && price)) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
*/
exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total * 0.01;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      createBookingCheckout(event.data.object);
    }

    res.status(200).json({
      receive: true,
    });
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
};
