const {
  getUserByUsername, updateUser, insertUser,
} = require('../../queries/users');
const { exchangeCodeForTokensReq, getUserInfo } = require('../../services/reddit');
const { calcExpiresOn } = require('../../utils/date');
const { logRequest } = require('../../utils/debug');
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

      const { data: fetchedUser } = await getUserInfo(accessToken);

      const userExists = await getUserByUsername(fetchedUser.name);

      user = {
        id: fetchedUser.id,
        username: fetchedUser.name,
        accessToken,
        refreshToken,
        expiresOn,
      };

      let updatedUser = null;
      let insertedUser = null;

      if (userExists.length === 1) {
        updatedUser = await updateUser({
          expires_on: expiresOn,
          access_token: accessToken,
          refresh_token: refreshToken,
        }, { id: fetchedUser.id, username: fetchedUser.name });
      } else if (userExists.length === 0) {
        insertedUser = await insertUser(user);
      } else {
        throw new Error('User array did not match 0 (user did not exist) or 1 (exactly one user exists)');
      }

      // TODO: if user already exists revoke the token first

      if (updatedUser || insertedUser) {
        setSession(
          req,
          {
            ...user,
            isImported: userExists.length
              ? userExists[0].isImported : insertedUser[0].isImported,
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
