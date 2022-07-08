const Knex = require('knex');
const config = require('config');

const knexConfig = require('./knexfile');

let knex;

function init() {
  const { DECLUTTER_ENV } = config.get('app');
  knex = Knex(knexConfig[DECLUTTER_ENV]);
}

function getInstance() {
  return knex;
}

module.exports = {
  init,
  getInstance,
};
