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
};
module.exports = {
  get: (prop) => (config[prop]),
  config,
};
