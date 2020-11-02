const User = require('../models/userModel');
const AppError = require('../utils/AppError.class');
const catchAsync = require('../utils/catchAsync.wrapper');
const filterObject = require('../utils/filterObject');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Error if user POSTs a password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Cannot update password with this route, please use /update-my-password',
        401
      )
    );
  }

  // 2) Update the user, filter out unneeded fields
  const filteredBody = filterObject(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.createUser = (req, res, next) => res.redirect(301, '/signup');
exports.getUser = factory.getOne(User);
//do not change passwords with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
