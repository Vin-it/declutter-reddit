const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'postgres';
const DB_URL = process.env.DB_URL || '';

export {
  DB_HOST,
  DB_NAME,
  DB_URL,
};
