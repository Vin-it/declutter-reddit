import { Request, Response } from 'express';

function getLoggedInUser(req: Request, res: Response) {
  if (!res.locals.isInSession) {
    res.status(401).send();
  } else {
    res.status(200).json({ data: { user: req.session.user } });
  }
}

export default getLoggedInUser;
