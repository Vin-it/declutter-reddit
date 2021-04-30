const express = require('express');
const session = require('express-session');
const config = require('config');

const knex = require('./lib/database/knex');
const objection = require('./lib/database/objection');
const { initDebug, logServer } = require('./lib/utils/debug');
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

  // Add migration runner here
  knex.init();
  objection.init(knex.getInstance());
  initDebug();
  initMiddlewares(app);

  app.listen(PORT, () => {
    logServer('App is listening to', PORT);
  });
}

(() => {
  initApp();
})();
