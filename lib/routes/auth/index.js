const express = require('express');

const { isInSession } = require('../../middleware/user');

const authRouter = express.Router();

authRouter.use(express.urlencoded({ extended: true }));
authRouter.use(express.json());

authRouter.get('/', isInSession, (req, res) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
  } else {
    res.render('index', { user: req.session.user });
  }
});

authRouter.get('/user', isInSession, require('./get-user'));

authRouter.get('/logout', require('./get-logout'));

authRouter.get('/login', isInSession, require('./get-login'));

authRouter.post('/login', isInSession, require('./post-login'));

authRouter.get('/redirect/reddit', require('./get-redirect'));

module.exports = authRouter;
