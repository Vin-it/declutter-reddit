import Knex from "knex";

exports.up = function (knex: Knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.string('id', 8).primary();
      table.string('username', 255).notNullable().unique();
      table.string('refresh_token', 255).notNullable();
      table.string('access_token', 255).notNullable();
      table.timestamp('expires_on').notNullable();
      table.boolean('isImported').notNullable().defaultTo(false);
    });
};

exports.down = function (knex: Knex) {
  return knex.schema
    .dropTable('users');
};
