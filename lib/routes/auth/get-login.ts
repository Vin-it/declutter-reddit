import { Request, Response } from 'express';

const getLogin = (req: Request, res: Response) => {
  if (res.locals.isInSession) {
    res.redirect('/');
  }
  res.render('index');
};

export default getLogin;
