import axios, { type AxiosResponse } from 'axios';
import config from 'config';
import { URLSearchParams } from 'node:url';
import { logRequest } from '../utils/debug';
import { RedditRequestError } from '../utils/error-types';
import type oauth from '../constants/oauth';
import type reddit from '../constants/reddit';
import type errors from '../constants/errors';

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  GRANT_TYPE_AUTH_CODE,
  GRANT_TYPE_REFRESH_TOKEN,
  REDDIT_OAUTH_TOKEN_URL,
} = config.get<typeof oauth>('oauth');

const { REDDIT_API_BASE_URL } = config.get<typeof reddit>('reddit');
const { REDDIT_REQUEST_ERR_MESSAGE } = config.get<typeof errors>('errors');

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

async function exchangeCodeForTokensReq(
  code: string,
): Promise<AxiosResponse<Tokens>> {
  const body = new URLSearchParams({
    grant_type: GRANT_TYPE_AUTH_CODE,
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const res = await axios.post(REDDIT_OAUTH_TOKEN_URL, body, {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logRequest('Error while exchaning code for token', error.message);
    }
    throw new RedditRequestError(REDDIT_REQUEST_ERR_MESSAGE);
  }
}

async function getUserInfo(accessToken: string) {
  try {
    const response = await axios.get(`${REDDIT_API_BASE_URL}/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      logRequest(
        'Error while making a request to get user info from reddit',
        error.message,
      );
    }
    throw new RedditRequestError(REDDIT_REQUEST_ERR_MESSAGE);
  }
}

async function refreshAccessToken(refreshToken: string) {
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
  });

  try {
    return await axios.post(REDDIT_OAUTH_TOKEN_URL, params, {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      logRequest(`Error while refreshing access_token: ${error.message}`);
    }
    throw new RedditRequestError(REDDIT_REQUEST_ERR_MESSAGE);
  }
}

const fetchSavedLinks = async (
  accessToken: string,
  username: string,
  after?: string,
  before?: string,
) => {
  try {
    const response = await axios.get(
      `${REDDIT_API_BASE_URL}/user/${username}/saved?after=${after}&before=${before}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      logRequest(
        'Error while making a request to get user info from reddit',
        error.message,
      );
    }
    throw new RedditRequestError(REDDIT_REQUEST_ERR_MESSAGE);
  }
};

export {
  fetchSavedLinks,
  exchangeCodeForTokensReq,
  getUserInfo,
  refreshAccessToken,
};
