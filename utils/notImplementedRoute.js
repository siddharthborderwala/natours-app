const AppError = require('./AppError.class');

exports.notImplementedRoute = (_, __, next) => {
  return next(new AppError('Not implemented', 500));
};
