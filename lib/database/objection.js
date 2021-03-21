const { Model } = require('objection');
const knex = require('./knex');

function init() {
  Model.knex(knex.getInstance());
}

module.exports = {
  init,
};
