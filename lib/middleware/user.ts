import { type NextFunction, type Request, type Response } from 'express';

import { handleExpiredAccessToken } from '../routes/auth/post-login';

async function isInSession(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    if (new Date(req.session.user.expiresOn) > new Date()) {
      res.locals.isInSession = true;
    } else {
      await handleExpiredAccessToken(req.session.user.username);
    }
  } else {
    res.locals.isInSession = false;
  }
  next();
}

export { isInSession };
