import Connection from 'mysql2/typings/mysql/lib/Connection';
import { DB_HOST, DB_NAME, DB_URL } from '../constants/database';

const nonLocalConnection = {
  client: 'mysql2',
  connection: DB_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export default {
  local: {
    client: 'mysql2',
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: 'root',
      password: 'password',
    },
    pool: {
      afterCreate(connection: Connection, callback: Function) {
        connection.query("SET time_zone = 'UTC';", (err: unknown) => {
          callback(err, connection);
        });
      },
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  development: nonLocalConnection,
  staging: nonLocalConnection,
  production: nonLocalConnection,

};
