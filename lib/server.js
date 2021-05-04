const config = require('config');
const express = require('express');
const connectSessionKnex = require('connect-session-knex');
const path = require('path');
const session = require('express-session');

const { init: initKnex, getInstance: getKnexInstance } = require('./database/knex');
const { init: initObjection } = require('./database/objection');
const { init: initDebug, logServer, logDatabase } = require('./utils/debug');
const router = require('./router');
const errorHandler = require('./middleware/error-handler');

function initMiddlewares(app) {
  const knex = getKnexInstance();
  const KnexSessionStore = connectSessionKnex(session);

  app.set('view engine', 'ejs');
  app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({ knex, tablename: 'sessions', createTable: true }),
    cookie: { secure: false },
  }));
  app.use('/static', express.static(path.join(__dirname, '../public')));
  app.use('/static', express.static(path.join(__dirname, '../dist')));
  app.use(router);
  app.use(errorHandler);
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
  const RETRY_COUNT = 0;

  initDebug();
  initKnex();
  initObjection(knex());
  await initMigrations(knex(), RETRY_COUNT);
  initMiddlewares(app);

  app.listen(PORT, () => {
    logServer('App is listening to', PORT);
  });
}

module.exports = initApp;
