export const ENV_LOCAL = 'local';
export const ENV_DEVELOPMENT = 'development';
export const ENV_STAGING = 'staging';
export const ENV_PRODUCTION = 'production';
export const ENV_DEFAULT = ENV_LOCAL;

export const BASE_URL_LIST = {
  [ENV_LOCAL]: 'http://localhost:3000',
  [ENV_DEVELOPMENT]: 'https://declutter-dev.herokuapp.com',
  [ENV_STAGING]: 'https://declutter-staging.herokuapp.com',
  [ENV_PRODUCTION]: 'https://declutter-reddit.herokuapp.com',
};

export const BASE_URL = BASE_URL_LIST[process.env.DECLUTTER_ENV];
export const REDDIT_API_BASE_URL = 'https://oauth.reddit.com';
