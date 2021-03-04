const { insertUserIfNotExist } = require('../../queries/users');
const { exchangeCodeForTokensReq, getUserInfo } = require('../../services/reddit');
const { calcExpiresOn } = require('../../utils/date');
const { logRequest, logDatabase } = require('../../utils/debug');

module.exports = async function getRedirect(req, res) {
  let user;
  let tokens = {};
  const { state, code } = req.query;

  try {
    if (state && code) {
      tokens = await exchangeCodeForTokensReq(code);
    }

    if (tokens) {
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = tokens.data;

      const expiresOn = calcExpiresOn(expiresIn);

      const { data } = await getUserInfo(accessToken);

      user = {
        username: data.name,
        accessToken,
        refreshToken,
        expiresOn,
      };
      req.session.user = {
        username: data.name,
        accessToken,
        expiresOn,
      };

      const returnedUser = await insertUserIfNotExist(user);

      if (!returnedUser) logDatabase('User successfully created', user);

      if (returnedUser && !returnedUser.password) {
        res.render('index', { user });
      } else if (returnedUser && returnedUser.password) {
        res.send('This is where app\'s functions will exist');
      }
    }
  } catch (error) {
    logRequest(`getRedirect error: ${error.message}`);
    res.status(400).send({
      success: false,
    });
  }
};
