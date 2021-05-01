const express = require('express');
const session = require('express-session');
const config = require('config');

const { init: initKnex, getInstance: getKnexInstance } = require('./lib/database/knex');
const { init: initObjection } = require('./lib/database/objection');
const { init: initDebug, logServer, logDatabase } = require('./lib/utils/debug');
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

async function initMigrations(knex) {
  return knex.migrate.latest({
    directory: 'lib/database/migrations',
  }).then(() => {
    logDatabase('Migrations ran succcessfully');
  }).catch((error) => {
    logDatabase('Error running migrations', error.message);
  });
}

async function initApp() {
  const { PORT } = config.get('app');
  const app = express();
  const knex = getKnexInstance;

  initDebug();
  initKnex();
  initObjection(knex());
  await initMigrations(knex());
  initMiddlewares(app);

  app.listen(PORT, () => {
    logServer('App is listening to', PORT);
  });
}

(() => {
  initApp();
})();
