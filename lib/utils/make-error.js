const config = require('config');

const { SERVER_ERROR } = config.get('errors.codes');

function makeError(errorObject = {
  message: 'Something went wrong!',
  status: 500,
  expose: false,
  code: SERVER_ERROR,
}) {
  let error = new Error(errorObject.message);
  error = {
    ...error,
    ...errorObject,
  };

  return error;
}

module.exports = makeError;
