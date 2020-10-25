exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.varchar('username', 255).notNullable().unique();
      table.varchar('refresh_token', 255).notNullable();
      table.varchar('access_token', 255).notNullable();
      table.timestamp('expires_on').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('users');
};
