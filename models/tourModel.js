const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name field'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour name must have not more than 40 characters'],
      minlength: [6, 'A tour name must have 6 characters at the least'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration field'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size field'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty field'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a name field'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary field'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// we don't use arrow functions in mongoose for the 'this' keyword

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startsLocation: '2dsphere' });

//virtual property
//cannot be used for querying data
//can be used to put business logic into models
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate used in parent referencing
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

// QUERY MIDDLEWARE:
// tourSchema.pre('find', function () { //this only works for the .find() command
tourSchema.pre(/^find/, function (next) {
  //this regex selects all the methods that start with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

/*
tourSchema.post(/^find/, function (docs, next) {
  //this regex selects all the methods that start with fin
  console.log(`Find query took ${Date.now() - this.start} ms!`);
  next();
});
*/
//AGGREGATION MIDDLEWARE
/*
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    secretTour: { $ne: true },
  });
  next();
});
*/

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
