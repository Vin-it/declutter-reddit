const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'postgres';
const DB_URL = process.env.DB_URL || '';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'postgres';

export { DB_HOST, DB_NAME, DB_URL, DB_USER, DB_PASS };
