const { DB_HOST, DB_NAME, DB_URL } = require('../constants/database');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: 'root',
      password: 'password',
    },
    pool: {
      afterCreate(connection, callback) {
        connection.query("SET time_zone = 'UTC';", (err) => {
          callback(err, connection);
        });
      },
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
