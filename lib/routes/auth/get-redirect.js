const axios = require('axios');

const { insertUserIfNotExist } = require('../../queries/users');
const { logRequest, logDatabase } = require('../../utils/debug');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require('../../constants/oauth');

function exchangeCodeForTokensReq(code) {
  try {
    return axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
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
    logRequest('Error while exchaning code for token', error.message);
    throw new Error('Error while making reuqest to reddit');
  }
}

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
      const expiresOn = new Date(new Date().getTime() + expiresIn * 1000);
      const { data } = await axios.get('https://oauth.reddit.com/api/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
    logRequest(error.message);
    res.send('Something went wrong!');
  }

  res.end();
};
