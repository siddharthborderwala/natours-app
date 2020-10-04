const express = require('express');
const morgan = require('morgan');

//routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//handlers
const AppError = require('./utils/AppError.class');
const globalErrorHandler = require('./controllers/errorController');

//APP - INSTANCE OF EXPRESS
const app = express();

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.reqTime = new Date().toUTCString();
    next();
});

//MOUNTING ROUTERS AS MIDDLEWARE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} 😶`));
});

app.use(globalErrorHandler);

module.exports = app;
