import { DB_HOST, DB_NAME, DB_PASS, DB_URL, DB_USER } from '../constants/database'

const nonLocalConnection = {
  client: 'pg',
  connection: !DB_URL ? {
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
  } :  DB_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

export default {
  local: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASS,
    },
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: nonLocalConnection,
  staging: nonLocalConnection,
  production: nonLocalConnection
}
