const User = require('../database/models/User');

async function getUserByUsername(username, trx = {}) {
  return User.query(trx).where('username', username);
}

async function insertUserIfNotExist({ username, password, refresh_token, access_token, expires_on }) {
  try {
      return User.transaction(async (trx) => {
          const user = await getUserByUsername(username, trx);
          if (user.length) {
            return user;
          }

          const result = await User.query().insert({
              username,
              password,
              refresh_token,
              access_token,
              expires_on: expires_on
          });

          return result[0];
      });

  } catch (error) {
      throw new Error('Error inserting user in the database');
  }
}

module.exports = {
  getUserByUsername,
  insertUserIfNotExist,
};
