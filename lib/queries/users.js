const { User } = require('../database/models');

async function getUserByUsername(username, trx = null) {
  return User.query(trx).where('username', username);
}

function updateUser(patchClause, whereClause) {
  return User.query()
    .patch(patchClause).where(whereClause);
}

function insertUser({
  id, username, password, refreshToken, accessToken, expiresOn,
}) {
  return User.query().insert({
    id,
    username,
    password,
    refresh_token: refreshToken,
    access_token: accessToken,
    expires_on: expiresOn,
  });
}

module.exports = {
  getUserByUsername,
  insertUser,
  updateUser,
};
