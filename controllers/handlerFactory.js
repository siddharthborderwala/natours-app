const APIFeatures = require('../utils/APIFeatures.class');
const AppError = require('../utils/AppError.class');
const catchAsync = require('../utils/catchAsync.wrapper');

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    const data = {};
    data[modelName] = doc;

    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    const data = {};
    data[Model.modelName.toLowerCase()] = doc;

    res.status(201).json({
      status: 'success',
      data,
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    const data = {};
    data[modelName] = doc;

    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No ${Model.modelName} found with that ID`, 404)
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on tour (workaround)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourID };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    const modelName = Model.modelName.toLowerCase().concat('s');

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    const data = {};
    data[modelName] = doc;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data,
    });
  });
