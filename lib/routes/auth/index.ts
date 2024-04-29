import { Request, Response } from 'express';
import express from 'express';

import { isInSession } from '../../middleware/user';
import getUser from './get-user';
import getLogin from './get-login';
import getLogout from './get-logout';
import getRedirect from './get-redirect';

const authRouter = express.Router();

authRouter.use(express.urlencoded({ extended: true }));
authRouter.use(express.json());

authRouter.get('/', isInSession, (req: Request, res: Response) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
  } else {
    res.render('index', { user: req.session.user });
  }
});

authRouter.get('/user', isInSession, getUser);

authRouter.get('/logout', getLogout);

authRouter.get('/login', isInSession, getLogin);

authRouter.get('/redirect/reddit', getRedirect);

export default authRouter;
