const Knex = require('knex');
const { Model } = require('objection');

const connection = require('../knexfile').development;

Model.knex(Knex(connection));

class User extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = User;
