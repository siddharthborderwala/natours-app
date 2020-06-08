//
//  EVERYTHING EXPRESS APP RELATED
//

//THIRD PARTY MODULES
const express = require('express');
const morgan = require('morgan');

//PERSONAL MODULES
//routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//APP - INSTANCE OF EXPRESS
const app = express();

//MIDDLEWARE
app.use(morgan('dev'));     //for logging information regarding requests
app.use(express.json());    //for turning the data in request into JSON format

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});
//next() is important as fuck to continue the (req,res) to the next middleware

//this function gives a timestamp property to the incoming request
app.use((req, res, next) => {
    req.reqTime = new Date().toUTCString();
    next();
});

//MOUNTING ROUTERS AS MIDDLEWARES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
