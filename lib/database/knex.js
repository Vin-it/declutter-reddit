const Knex = require('knex');
const config = require('config');

const knexConfig = require('./knexfile');

let knex;

function init() {
  const { NODE_ENV } = config.get('app');

  knex = Knex(knexConfig[NODE_ENV]);
}

function getInstance() {
  return knex;
}

module.exports = {
  init,
  getInstance,
};
