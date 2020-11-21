const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch(err => console.log(err));

//READ TOUR DATA FILE

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const reviewsData = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORT DATA INTO DB

const importData = async resource => {
  try {
    if (resource === 'tours') await Tour.create(toursData);
    else if (resource === 'users')
      await User.create(usersData, {
        validateBeforeSave: false,
      });
    else if (resource === 'reviews') await Review.create(reviewsData);
    else if (resource === 'all') {
      await User.create(usersData, {
        validateBeforeSave: false,
      });
      await Tour.create(toursData);
      await Review.create(reviewsData);
    } else throw new Error('Invalid resource');
    return 'Success importing data into DB';
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
};

//DELETE ALL DATA FROM TOUR COLLECTION

const deleteData = async resource => {
  try {
    if (resource === 'tours') await Tour.deleteMany();
    else if (resource === 'users') await User.deleteMany();
    else if (resource === 'reviews') await Review.deleteMany();
    else if (resource === 'all') {
      await Tour.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
    } else throw new Error('Invalid resource');
    return 'Successfully deleted data from DB';
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
};

const main = async () => {
  let result;

  if (process.argv[2] === '--import')
    result = await importData(process.argv[3]);
  else if (process.argv[2] === '--delete')
    result = await deleteData(process.argv[3]);

  console.log(result);
  process.exit(0);
};

main();
