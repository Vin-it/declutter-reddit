import Knex from 'knex';

exports.up = function (knex: ReturnType<typeof Knex>) {
  return knex.schema.createTable('saved_links', (table) => {
    table.increments('id');
    table.text('title');
    table
      .string('user_id', 8)
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('restrict');
  });
};

exports.down = function (knex: ReturnType<typeof Knex>) {
  return knex.schema.dropTable('saved_links');
};
