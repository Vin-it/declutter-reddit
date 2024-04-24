export default {
  CLIENT_ID: process.env.REDDIT_APP_CLIENT_ID ?? '',
  CLIENT_SECRET: process.env.REDDIT_APP_CLIENT_SECRET ?? '',
  REDIRECT_URI: process.env.REDDIT_APP_REDIRECT_URI ?? '',
  GRANT_TYPE_AUTH_CODE: 'authorization_code',
  GRANT_TYPE_REFRESH_TOKEN: 'refresh_token',
  REDDIT_OAUTH_TOKEN_URL: 'https://www.reddit.com/api/v1/access_token'
}
