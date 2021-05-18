const { logServer } = require('../utils/debug');

function defaultErrorHandler(error, req, res, next) {
  if (!error) {
    next();
  }

  logServer('defaultErrorHandler', error.message);
  if (error.expose) {
    res.json({
      success: false,
      message: error.message,
    });
  } else {
    res.json({
      success: false,
      message: 'Something went wrong',
    });
  }
}

module.exports = defaultErrorHandler;
