const Knex = require('knex');
const { Model } = require('objection');

const connection = require('../knexfile')[process.env.NODE_ENV];

Model.knex(Knex(connection));

class User extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = User;
