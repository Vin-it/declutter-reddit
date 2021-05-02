const express = require('express');
const session = require('express-session');
const config = require('config');

const { init: initKnex, getInstance: getKnexInstance } = require('./database/knex');
const { init: initObjection } = require('./database/objection');
const { init: initDebug, logServer, logDatabase } = require('./utils/debug');
const router = require('./router');

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

async function initMigrations(knex, retryCount) {
  if (retryCount === 3) {
    throw Error('Failed to run migrations after 3 retries');
  }

  return knex.migrate.latest({
    directory: 'lib/database/migrations',
  }).then(() => {
    logDatabase('Migrations ran succcessfully');
  }).catch((error) => {
    logDatabase('Error running migrations, retrying in 10 seconds...', error.message);
    setTimeout(() => initMigrations(knex, retryCount + 1), 10000);
  });
}

async function initApp() {
  const { PORT } = config.get('app');
  const app = express();
  const knex = getKnexInstance;

  initDebug();
  initKnex();
  initObjection(knex());
  await initMigrations(knex(), 0);
  initMiddlewares(app);

  app.listen(PORT, () => {
    logServer('App is listening to', PORT);
  });
}

module.exports = initApp;
