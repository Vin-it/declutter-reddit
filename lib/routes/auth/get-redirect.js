const { insertUserIfNotExist } = require('../../queries/users');
const { exchangeCodeForTokensReq, getUserInfo } = require('../../services/reddit');
const { calcExpiresOn } = require('../../utils/date');
const { logRequest, logDatabase } = require('../../utils/debug');
const { setSession } = require('../../utils/set-session');

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
        id: data.id,
        username: data.name,
        accessToken,
        refreshToken,
        expiresOn,
      };

      const returnedUser = await insertUserIfNotExist(user);

      if (
        (Array.isArray(returnedUser) && returnedUser.length === 1)
        || (!Array.isArray(returnedUser) && returnedUser)
      ) {
        logDatabase('User successfully created', user);

        setSession(
          req,
          {
            ...user,
            isImported: returnedUser.isImported,
          },
          accessToken,
          expiresOn,
        );

        res.redirect('/');
      }
    }
  } catch (error) {
    logRequest(`getRedirect error: ${error.message}`);
    res.status(400).send({
      success: false,
    });
  }
};
