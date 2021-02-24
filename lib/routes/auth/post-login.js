const axios = require('axios');
const { CLIENT_ID, CLIENT_SECRET } = require('../../constants/oauth');
const { getUserByUsername, updateAccessToken } = require('../../queries/users');
const { logRequest } = require('../../utils/debug');

function refreshAccessToken(user) {
  const params = new URLSearchParams({
    refresh_token: user.refresh_token,
    grant_type: 'refresh_token',
  });

  try {
    return axios.post(
      'https://www.reddit.com/api/v1/access_token',
      params,
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  } catch (error) {
    logRequest(`Error while refreshing access_token ${error.message}`);
    throw new Error(error.message);
  }
}

async function postLogin(req, res) {
  const { username } = req.body;

  const user = (await getUserByUsername(username))[0];

  if (!user) {
    const error = new Error('Incorrect combination of username and password');
    error.status = 400;
    res.status(400).send(error);
  }

  if (new Date(user.expires_on) > new Date()) {
    req.session.user = {
      username: user.username,
      accessToken: user.access_token,
      expiresOn: user.expires_on,
    };
  } else {
    const response = await refreshAccessToken(user);
    const expiresOn = new Date(new Date().getTime() + response.data.expires_in * 1000);
    const updatedToken = await updateAccessToken(response.data.access_token, expiresOn, username);

    if (!updatedToken) {
      const error = new Error('Failed to insert refreshed access token into the database');
      error.status = 400;
      res.status(400).send(error);
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
