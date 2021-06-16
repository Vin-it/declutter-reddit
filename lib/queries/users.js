const { User } = require('../database/models');

async function getUserByUsername(username, trx = null) {
  return User.query(trx).where('username', username);
}

async function insertUserIfNotExist({
  id, username, password, refreshToken, accessToken, expiresOn,
}) {
  return User.transaction(async (trx) => {
    const user = await getUserByUsername(username, trx);
    if (Array.isArray(user)) {
      if (user.length === 1) {
        return user[0];
      } if (user.length > 1) {
        throw new Error('Multiple user for single username');
      }
    }

    const result = await User.query().insert({
      id,
      username,
      password,
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_on: expiresOn,
    });

    return result;
  });
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
