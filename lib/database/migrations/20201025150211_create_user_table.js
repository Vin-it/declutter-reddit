exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.varchar('id', 8).primary();
      table.varchar('username', 255).notNullable().unique();
      table.varchar('refresh_token', 255).notNullable();
      table.varchar('access_token', 255).notNullable();
      table.timestamp('expires_on').notNullable();
      table.boolean('isImported').notNullable().defaultTo(false);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('users');
};
