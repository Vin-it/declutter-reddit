const express = require('express');

const { isInSession } = require('../../middleware/user');
const { CLIENT_ID, REDIRECT_URI } = require('../../constants/oauth');

const authRouter = express.Router();

authRouter.use(express.urlencoded({ extended: true }));

authRouter.get('/', isInSession, (req, res) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
  } else {
    res.render('index', { user: req.session.user });
  }
});

authRouter.get('/logout', (req) => {
  req.session.destroy();
});

authRouter.get('/login', isInSession, (req, res) => {
  if (res.locals.isInSession) {
    res.redirect('/');
  }
  res.render('login', {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
  });
});

authRouter.post('/login', isInSession, require('./post-login'));

authRouter.get('/redirect/reddit', require('./get-redirect'));

module.exports = authRouter;
