const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
//routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//handlers
const AppError = require('./utils/AppError.class');
const globalErrorHandler = require('./controllers/errorController');

//APP - INSTANCE OF EXPRESS
const app = express();

//MIDDLEWARE STACk

// security headers
app.use(helmet());

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request, please try again later!',
});
// rate limiting
app.use('/api', limiter);

// reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xssClean());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// serve static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, _, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

//MOUNTING ROUTERS AS MIDDLEWARE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, _, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} 😶`));
});

app.use(globalErrorHandler);

module.exports = app;
