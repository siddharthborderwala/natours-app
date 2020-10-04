const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError.class');
const catchAsync = require('../utils/catchAsync.wrapper');
const User = require('../models/userModel');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const {
        name,
        email,
        password,
        passwordConfirm,
        photo = undefined,
    } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        photo,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: {
                name: newUser.name,
                email: newUser.email,
                photo: newUser.photo,
            },
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //check if email and password exist
    if (!(email && password)) {
        return next(
            new AppError('Please provide an email and a password'),
            400
        );
    }
    //check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    const isAuthorized =
        user && (await user.correctPassword(password, user.password));

    if (!isAuthorized) {
        return next(new AppError('Incorrect email or password', 401));
    }
    //send token to client
    const token = signToken(user._id);
    req.status(200).json({
        status: 'success',
        token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('Please login to get access', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
        return next(new AppError('User not found, not authorized', 401));

    if (freshUser.changedPasswordAfter(decoded.iat))
        return next(
            new AppError(
                'Password was changed recently, please login again',
                401
            )
        );

    req.user = freshUser;
    next();
});
