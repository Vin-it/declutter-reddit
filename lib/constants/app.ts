const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DECLUTTER_ENV = process.env.DECLUTTER_ENV || 'local';

export default {
  PORT,
  NODE_ENV,
  DECLUTTER_ENV,
};
