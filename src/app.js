import express from 'express';
import dotenv from 'dotenv';
import { Auth, Announcements, User } from './routes';

dotenv.config();

const app = express();
const { HOST, PORT } = process.env;

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/auth', Auth);
app.use('/api/v1/announcement', Announcements);
app.use('/api/v1/user', User);

// handle 404
app.use((req, res, next) => {
  next({
    status: 404,
    message: `${req.url} not found`,
  });
});

// Handle all errors thrown in the app
app.use(({ status, message }, req, res, next) => {
  res.status(status || 500)
    .json({
      status: 'error',
      error: message,
    });
  next();
});

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`ANNOUNCEIT API LISTENING ON http://${HOST}:${PORT}`);
});

export default app;
