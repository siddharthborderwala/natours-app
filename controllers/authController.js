const { promisify } = require('util');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError.class');
const catchAsync = require('../utils/catchAsync.wrapper');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exist
  if (!(email && password)) {
    return next(new AppError('Please provide an email and a password'), 400);
  }
  //check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  const isAuthorized =
    user && (await user.correctPassword(password, user.password));

  if (!isAuthorized) {
    return next(new AppError('Incorrect email or password', 401));
  }
  console.log(user);
  //send token to client
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('Please login to get access', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError('User not found, not authorized', 401));

  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('Password was changed recently, please login again', 401)
    );

  req.user = freshUser;
  res.locals.user = freshUser;
  return next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      const freshUser = await User.findById(decoded.id);
      if (!freshUser) return next();
      if (freshUser.changedPasswordAfter(decoded.iat)) return next();

      res.locals.user = freshUser;
    } catch (err) {
      return next();
    }
  }
  return next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Permission not granted, not authorized', 403));
  }

  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({
    email: req.body.email,
  });

  // 2) Get a random reset token
  if (!user) {
    return next(new AppError('No user with that email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid or 10 minutes)',
      message,
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error sending the email, please try again', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: {
      $gte: Date.now(),
    },
  });

  // 2) If token not expired, set new password
  if (!user) return next(new AppError('Reset token expired', 400));

  // 3) Update changePasswordAt for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.save();

  // 4) Log the user in and send jwt
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // We don't use update method for the mongoose hooks to work

  // 4) Log the user in, i.e. send fresh JWT
  createAndSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged-out', {
    expiresIn: new Date(Date.now() + 10 ** 4),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
