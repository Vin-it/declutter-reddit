const express = require('express');
const bodyParser = require('body-parser');

const { isInSession } = require('../../middleware/user');
const { CLIENT_ID, REDIRECT_URI } = require('../../constants/oauth');

const authRouter = express.Router();

authRouter.use(bodyParser.urlencoded({ extended: true }));

authRouter.get('/', isInSession, (req, res) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
  } else {
    res.send('Home');
  }
});

authRouter.get('/logout', (req) => {
  req.session.destroy();
});

authRouter.get('/login', (req, res) => {
  res.render('login', {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
  });
});

authRouter.post('/login', require('./post-login'));

authRouter.get('/redirect/reddit', require('./get-redirect'));

module.exports = authRouter;
