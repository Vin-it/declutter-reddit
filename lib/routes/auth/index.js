const express = require('express');

const { isInSession } = require('../../middleware/user');
const { CLIENT_ID, REDIRECT_URI } = require('../../constants/oauth');

const authRouter = express.Router();

authRouter.get('/', isInSession, (req, res) => {
  if (!res.locals.isInSession) {
    res.redirect('/login');
  } else {
    res.send('Home');
  }
});

authRouter.get('/login', (req, res) => {
  res.render('login', {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
  });
});

authRouter.post('/login', (req, res) => {
  res.send('Received login');
});

authRouter.get('/redirect/reddit', require('./get-redirect'));

module.exports = authRouter;
