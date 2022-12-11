import _ from 'lodash';

import  { errors, oauth, reddit } from '../../../config/default';

const config = {
  oauth: {
    ...oauth,
    CLIENT_ID: 'fake-client-id',
    CLIENT_SECRET: 'fake-client-secret',
    REDIRECT_URI: 'fake-redirect-url',
    REDDIT_OAUTH_TOKEN_URL: 'fake-oauth-token-url',
  },
  reddit: {
    ...reddit,
    REDDIT_API_BASE_URL: 'https://fake-reddit-api-url.com',
  },
  errors,
};

const get = (path: string) => (_.get(config, path));
export default { 
  ...config,
  get
}

