export const ENV_LOCAL = 'local'
export const ENV_DEVELOPMENT = 'development'
export const ENV_STAGING = 'staging'
export const ENV_PRODUCTION = 'production'
export const ENV_DEFAULT = ENV_LOCAL
type ALL_ENVS =
  | typeof ENV_LOCAL
  | typeof ENV_DEVELOPMENT
  | typeof ENV_STAGING
  | typeof ENV_DEFAULT
const ALL_ENV_ARRAY = [
  ENV_LOCAL,
  ENV_DEFAULT,
  ENV_DEVELOPMENT,
  ENV_PRODUCTION,
  ENV_STAGING
]

export const BASE_URL_LIST = {
  [ENV_LOCAL]: 'http://localhost:3000',
  [ENV_DEVELOPMENT]: 'https://declutter-dev.herokuapp.com',
  [ENV_STAGING]: 'https://declutter-staging.herokuapp.com',
  [ENV_PRODUCTION]: 'https://declutter-reddit.herokuapp.com'
}

const isEnvTypeSafe = (strEnv: string | undefined): strEnv is ALL_ENVS => {
  return Boolean(strEnv && ALL_ENV_ARRAY.includes(strEnv))
}
const DECLUTTER_ENV = process.env.DECLUTTER_ENV
export const BASE_URL =
  BASE_URL_LIST[isEnvTypeSafe(DECLUTTER_ENV) ? DECLUTTER_ENV : ENV_DEFAULT]
export const REDDIT_API_BASE_URL = 'https://oauth.reddit.com'
