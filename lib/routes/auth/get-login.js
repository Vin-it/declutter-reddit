const config = require('config');

function getLogin(req, res) {
  const { CLIENT_ID, REDIRECT_URI } = config.get('oauth');

  if (res.locals.isInSession) {
    res.redirect('/');
  }
  res.render('login', {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
  });
}

module.exports = getLogin;
