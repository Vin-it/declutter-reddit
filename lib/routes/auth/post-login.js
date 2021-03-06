const { getUserByUsername, updateAccessToken } = require('../../queries/users');
const { refreshAccessToken } = require('../../services/reddit');
const { calcExpiresOn } = require('../../utils/date');

async function postLogin(req, res) {
  const { username } = req.body;

  const user = (await getUserByUsername(username))[0];

  if (!user) {
    const error = new Error('Incorrect combination of username and password');
    error.status = 400;
    throw error;
  }

  if (new Date(user.expires_on) > new Date()) {
    req.session.user = {
      username: user.username,
      accessToken: user.access_token,
      expiresOn: user.expires_on,
    };
  } else {
    const response = await refreshAccessToken(user);
    const expiresOn = calcExpiresOn(response.data.expires_in);

    const updatedToken = await updateAccessToken(response.data.access_token, expiresOn, username);

    if (!updatedToken) {
      const error = new Error('Failed to insert refreshed access token into the database');
      error.status = 400;
      throw error;
    }

    req.session.user = {
      username: user.username,
      accessToken: response.data.access_token,
      expiresOn,
    };
  }

  res.render('index', { user: req.session.user });
}

module.exports = postLogin;
