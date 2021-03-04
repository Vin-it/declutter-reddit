const axios = require('axios');
const config = require('config');

const { logRequest } = require('../utils/debug');
const { RedditRequestError } = require('../utils/error-types');

function exchangeCodeForTokensReq(code) {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = config.get('oauth');
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
    throw new RedditRequestError('Error while making reuqest to reddit');
  }
}

async function getUserInfo(accessToken) {
  try {
    return axios.get('https://oauth.reddit.com/api/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logRequest('Error while making a request to get user info from reddit');
    throw new RedditRequestError('Error while making a request to reddit');
  }
}

module.exports = {
  exchangeCodeForTokensReq,
  getUserInfo,
};
