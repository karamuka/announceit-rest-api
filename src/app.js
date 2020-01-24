import express from 'express';
import dotenv from 'dotenv';
import { Auth, Announcements } from './routes';

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

app.use(express.json());

app.use('/api/v1/auth', Auth);
app.use('/api/v1/announcements', Announcements);

// handle 404
app.use((req, res, next) => {
  const notFoundError = new Error(`${req.url} not found`);
  notFoundError.status = 404;
  next(notFoundError);
});

// Handle all errors thrown in the app
app.use((customError, req, res) => {
  res.status(customError.status || 500)
    .json({
      status: 'error',
      error: customError.message,
    });
});

app.listen(PORT, HOST);

export default app;
