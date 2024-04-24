import { type NextFunction, type Request, type Response } from 'express'

import { handleExpiredAccessToken } from '../routes/auth/post-login'

async function isInSession (req: Request, res: Response, next: NextFunction) {
  console.log('IsInSession')
  if (req.session.user) {
    console.log('if')
    if (new Date(req.session.user.expiresOn) > new Date()) {
      res.locals.isInSession = true
    } else {
      console.log('else')
      await handleExpiredAccessToken(req.session.user.username)
    }
  } else {
    res.locals.isInSession = false
  }
  console.log('next will be called', next)
  next()
}

export {
  isInSession
}
