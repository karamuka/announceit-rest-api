const express = require('express');
const { json, urlencoded } = require('body-parser');
const dotenv = require('dotenv');
const { Auth } = require('./routes');

dotenv.config();
const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

// Handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PATCH, GET');
    return res.sendStatus(200);
  }
  return next();
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1/auth', Auth);

// handle 404
app.use((req, res, next) => {
  const customError = new Error(`${req.url} not found`);
  customError.status = 404;
  next(customError);
});

// Handle all errors thrown in application
app.use((customError, req, res) => {
  res.status(customError.status || 500)
    .json({
      status: 'error',
      error: customError.message,
    });
});

app.listen(PORT, HOST);

module.exports = app;
