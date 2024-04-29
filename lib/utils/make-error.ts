import config from 'config'

const { SERVER_ERROR } = config.get<{ SERVER_ERROR: unknown }>('errors.codes')

function makeError (errorObject = {
  message: 'Something went wrong!',
  status: 500,
  expose: false,
  code: SERVER_ERROR
}) {
  let error = new Error(errorObject.message)
  error = {
    ...error,
    ...errorObject
  }

  return error
}

export default makeError
