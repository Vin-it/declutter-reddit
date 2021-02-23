const express = require('express');
const session = require('express-session');

const { initDebug, logServer } = require('./lib/utils/debug');

const router = require('./lib/router');
const { PORT } = require('./lib/constants/app');

const app = express();

app.set('view engine', 'ejs');
app.use(session({
  secret: 'fakeSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(router);

app.listen(PORT, () => {
  initDebug();

  logServer('App is listening to', PORT);
});
