const User = require('../database/models/User');

async function getUserByUsername(username, trx = null) {
  return User.query(trx).where('username', username);
}

async function insertUserIfNotExist({
  username, password, refreshToken, accessToken, expiresOn,
}) {
  try {
    return User.transaction(async (trx) => {
      const user = await getUserByUsername(username, trx);
      if (user.length) {
        return user;
      }

      const result = await User.query().insert({
        username,
        password,
        refresh_token: refreshToken,
        access_token: accessToken,
        expires_on: expiresOn,
      });

      return result;
    });
  } catch (error) {
    throw new Error('Error inserting user in the database');
  }
}

function updateAccessToken(accessToken, expiresOn, username) {
  return User.query()
    .patch({
      access_token: accessToken,
      expires_on: expiresOn,
    }).where('username', username);
}

module.exports = {
  getUserByUsername,
  insertUserIfNotExist,
  updateAccessToken,
};
