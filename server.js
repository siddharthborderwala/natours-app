//
//	EVERYTHING SERVER RELATED
//
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', error => {
  console.log(
    'UNCAUGHT EXCEPTION 💢:',
    error.name,
    error.message,
    error.stack,
    '\nGracefully shutting down...'
  );
  process.exit(1);
});

dotenv.config({ path: './.env' });
process.env.NODE_ENV = process.argv[2].split('=')[1];

console.log('Process environment NODE_ENV:', process.env.NODE_ENV);

const app = require('./app');

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
  .then(() => console.log('DB Connection was Successful'))
  .catch(error => console.error('ERROR:', error));

//LISTEN ON PORT 3000
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', error => {
  console.log(
    'UNHANDLED REJECTION 💥:',
    error.name,
    error.message,
    '\nGracefully shutting down...'
  );
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED 🙃, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated 💀');
  });
});
