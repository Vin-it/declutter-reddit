const config = require('config');

const { getUserByUsername, updateUser } = require('../../queries/users');
const { refreshAccessToken } = require('../../services/reddit');
const { calcExpiresOn } = require('../../utils/date');
const { logDatabase, logRequest } = require('../../utils/debug');
const { setSession } = require('../../utils/set-session');
const makeError = require('../../utils/make-error');

const {
  USER_NOT_FOUND,
  INSERT_FAIL,
} = config.get('errors.codes');

// TODO: move this to a different more appropriate location
async function handleExpiredAccessToken(username) {
  const [user] = await getUserByUsername(username);
  const response = await refreshAccessToken(user.refresh_token);
  const expiresOn = calcExpiresOn(response.data.expires_in);

  const updatedToken = await updateUser({
    access_token: response.data.access_token,
    expires_on: expiresOn,
  }, {
    username,
  });

  if (!updatedToken) {
    const error = makeError({
      message: 'Failed to insert refreshed access token into the database',
      status: 500,
      expose: false,
      code: INSERT_FAIL,
    });

    throw error;
  }

  return { response, expiresOn };
}

async function handleGetUser(username) {
  const [user] = (await getUserByUsername(username));

  if (!user) {
    const error = makeError({
      message: 'Incorrect combination of username and password',
      status: 404,
      code: USER_NOT_FOUND,
      expose: true,
    });

    throw error;
  }

  return user;
}

async function postLogin(req, res, next) {
  const { username } = req.body;

  let user = null;

  try {
    user = await handleGetUser(username);
  } catch (error) {
    logDatabase('Error while getting the user', error.message);
    next(error);
    return { success: false };
  }

  const isTokenExpired = new Date(user.expires_on) < new Date();

  if (!isTokenExpired) {
    setSession(req, user, user.access_token, user.expires_on);
  } else {
    try {
      const { response, expiresOn } = await handleExpiredAccessToken(user, username);
      setSession(req, user, response.data.access_token, expiresOn);
    } catch (error) {
      logRequest('Error while handling expired access token', error.message);
      next(error);
      return { success: false };
    }
  }
  res.render('index', { user: req.session.user });
  return { success: true };
}

module.exports = {
  postLogin,
  handleExpiredAccessToken,
};
