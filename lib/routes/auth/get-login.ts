import config from 'config';
import { Request, Response } from 'express';
import oauth from '../../constants/oauth';

const getLogin = (req: Request, res: Response) => {
  const { CLIENT_ID, REDIRECT_URI } = config.get<typeof oauth>('oauth');

  if (res.locals.isInSession) {
    res.redirect('/');
  }
  res.render('login', {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
  });
}

export default getLogin;
