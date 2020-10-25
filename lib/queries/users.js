const User = require('../database/models/User');

async function getUserByUsername(username, trx = {}) {
  return User.query(trx).where('username', username);
}

module.exports = {
  getUserByUsername,
};
