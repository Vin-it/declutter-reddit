import { type NextFunction, type Request, type Response } from 'express'

import { logServer } from '../utils/debug'

function defaultErrorHandler (
  error: Error & { expose: boolean },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!error) {
    next()
  }

  logServer('defaultErrorHandler', error.message)
  if (error.expose) {
    res.json({
      success: false,
      message: error.message
    })
  } else {
    res.json({
      success: false,
      message: 'Something went wrong'
    })
  }
}

export default defaultErrorHandler
