const { handleExpiredAccessToken } = require('../routes/auth/post-login');

async function isInSession(req, res, next) {
  if (req.session.user) {
    if (new Date(req.session.user.expiresOn) > new Date()) {
      res.locals.isInSession = true;
    } else {
      await handleExpiredAccessToken(req.session.user);
    }
  } else {
    res.locals.isInSession = false;
  }

  next();
}

module.exports = {
  isInSession,
};
