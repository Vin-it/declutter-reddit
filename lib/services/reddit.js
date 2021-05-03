const axios = require('axios');
const config = require('config');

const { logRequest } = require('../utils/debug');
const { RedditRequestError } = require('../utils/error-types');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  GRANT_TYPE_AUTH_CODE,
  GRANT_TYPE_REFRESH_TOKEN,
  REDDIT_OAUTH_TOKEN_URL,
} = config.get('oauth');

const { REDDIT_API_BASE_URL } = config.get('reddit');
const { REDDIT_REQUEST_ERR_MESSAGE } = config.get('errors');

async function exchangeCodeForTokensReq(code) {
  try {
    return await axios.post(
      REDDIT_OAUTH_TOKEN_URL,
      `grant_type=${GRANT_TYPE_AUTH_CODE}&code=${code}&redirect_uri=${REDIRECT_URI}`,
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
    throw new RedditRequestError(REDDIT_REQUEST_ERR_MESSAGE);
  }
}

async function getUserInfo(accessToken) {
  try {
    return await axios.get(`${REDDIT_API_BASE_URL}/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logRequest('Error while making a request to get user info from reddit', error.message);
    throw new RedditRequestError(REDDIT_REQUEST_ERR_MESSAGE);
  }
}

async function refreshAccessToken(user) {
  const params = new URLSearchParams({
    refresh_token: user.refresh_token,
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
  });

  try {
    return await axios.post(
      REDDIT_OAUTH_TOKEN_URL,
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
    logRequest(`Error while refreshing access_token: ${error.message}`);
    throw new RedditRequestError(error.message);
  }
}

module.exports = {
  exchangeCodeForTokensReq,
  getUserInfo,
  refreshAccessToken,
};
