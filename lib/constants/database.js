const DB_HOST = process.env.DB_HOST || 'db-reddit';
const DB_NAME = process.env.DB_NAME || 'reddit';
const DB_URL = process.env.DB_URL || '';

module.exports = {
  DB_HOST,
  DB_NAME,
  DB_URL,
};
