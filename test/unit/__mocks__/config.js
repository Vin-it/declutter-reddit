const constants = require('../../../config/default');

const config = {
  ...constants,
  oauth: {
    ...constants.oauth,
    CLIENT_ID: 'fake-client-id',
    CLIENT_SECRET: 'fake-client-secret',
    REDIRECT_URI: 'fake-redirect-url',
    REDDIT_OAUTH_TOKEN_URL: 'fake-oauth-token-url',
  },
  reddit: {
    ...constants.reddit,
    REDDIT_API_BASE_URL: 'https://fake-reddit-api-url.com',
  },
};
module.exports = {
  get: (prop) => (config[prop]),
  config,
};
