const { getUserByUsername, updateAccessToken } = require('../../queries/users');
const { refreshAccessToken } = require('../../services/reddit');
const { calcExpiresOn } = require('../../utils/date');
const { logDatabase, logRequest } = require('../../utils/debug');

function handleError(error, res) {
  if (error.expose) {
    res.json({
      success: false,
      message: error.message,
    });
  } else {
    res.json({
      success: false,
      message: 'something went wrong',
    });
  }
}

async function handleExpiredAccessToken(user, username) {
  const response = await refreshAccessToken(user);
  const expiresOn = calcExpiresOn(response.data.expires_in);

  const updatedToken = await updateAccessToken(response.data.access_token, expiresOn, username);

  if (!updatedToken) {
    const error = new Error('Failed to insert refreshed access token into the database');
    error.status = 400;
    error.expose = false;
    error.code = 'REFRESH_TOKEN_GRANT';
    throw error;
  }

  return { response, expiresOn };
}

async function handleGetUser(username) {
  const [user] = (await getUserByUsername(username));

  if (!user) {
    const error = new Error('Incorrect combination of username and password');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    error.expose = true;
    throw error;
  }

  return user;
}

async function postLogin(req, res) {
  const { username } = req.body;

  let user = null;

  try {
    user = await handleGetUser(username);
  } catch (error) {
    logDatabase('Error while getting the user', error.message);
    handleError(error, res);
    return { success: false };
  }

  const isTokenExpired = new Date(user.expires_on) < new Date();

  if (!isTokenExpired) {
    req.session.user = {
      username: user.username,
      accessToken: user.access_token,
      expiresOn: user.expires_on,
    };
  } else {
    try {
      const { response, expiresOn } = await handleExpiredAccessToken(user, username);

      req.session.user = {
        username: user.username,
        accessToken: response.data.access_token,
        expiresOn,
      };
    } catch (error) {
      logRequest('Error while handling expired access token', error.message);
      handleError(error, res);
      return { success: false };
    }
  }
  res.render('index', { user: req.session.user });
  return { success: true };
}

module.exports = postLogin;
