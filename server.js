const express = require('express');
const session = require('express-session');
const config = require('config');

const { init: initKnex, getInstance: getKnexInstance } = require('./lib/database/knex');
const { init: initObjection } = require('./lib/database/objection');
const { init: initDebug, logServer } = require('./lib/utils/debug');
const router = require('./lib/router');

function initMiddlewares(app) {
  app.set('view engine', 'ejs');
  app.use(session({
    secret: 'fakeSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));
  app.use(router);
}

function initApp() {
  const { PORT } = config.get('app');
  const app = express();
  const knex = getKnexInstance;

  // Add migration runner here

  initKnex();
  initObjection(knex());
  initDebug();
  initMiddlewares(app);

  app.listen(PORT, () => {
    logServer('App is listening to', PORT);
  });
}

(() => {
  initApp();
})();
