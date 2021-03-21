const Knex = require('knex');
const config = require('./knexfile');

let knex;

function init() {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  knex = Knex(config[NODE_ENV]);
}

function getInstance() {
  return knex;
}

module.exports = {
  init,
  getInstance,
};
