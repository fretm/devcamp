const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
//load env vars

dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//route file
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// Body parser

app.use(express.json());

// Cookie parser
app.use(cookieParser());

//Middleware

// const logger = (req, res, next) => {
//   req.hello = 'hello world';
//   console.log('Middleware running');
//   next();
// };

// app.use(logger);

// Dev logging middleware

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
// File Uploading

app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));

//Mount router

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

//Mounting error handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process

  server.close(() => process.exit(1));
});
