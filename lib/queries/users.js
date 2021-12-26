const { User } = require('../database/models');

const { logDatabase } = require('../utils/debug');

async function getUserByUsername(username, trx = null) {
  return User.query(trx).where('username', username);
}

function updateUser(patchClause, whereClause) {
  return User.query()
    .patch(patchClause).where(whereClause);
}

async function insertorUpdateUser({
  id, username, password, refreshToken, accessToken, expiresOn,
}) {
  return User.transaction(async (trx) => {
    const user = await getUserByUsername(username, trx);
    if (Array.isArray(user)) {
      if (user.length === 1) {
        logDatabase('User already exists, and updating');
        const updatedUser = await updateUser({
          expires_on: expiresOn,
          access_token: accessToken,
          refresh_token: refreshToken,
        }, { id, username });
        if (updatedUser) logDatabase('User successfully updated');
        return updatedUser;
      } if (user.length > 1) {
        logDatabase('More than one user found for single username!');
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

    if (result) logDatabase('User successfully created');

    return result;
  });
}

module.exports = {
  getUserByUsername,
  insertorUpdateUser,
  updateUser,
};
