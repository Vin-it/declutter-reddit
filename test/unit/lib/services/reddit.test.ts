jest.mock('config');
jest.mock('../../../../lib/utils/debug');

import axios from 'axios';

import { exchangeCodeForTokensReq, getUserInfo } from '../../../../lib/services/reddit';
import * as utilsDebug from '../../../../lib/utils/debug';
import { RedditRequestError } from '../../../../lib/utils/error-types';

import config from '../../__mocks__/config';


const mockedAxiosPost = jest.spyOn(axios, 'post');
const mockedAxiosGet = jest.spyOn(axios, 'get');
const mockedLogRequest = jest.spyOn(utilsDebug, 'logRequest');

describe('lib/services/reddit', () => {

  const { REDDIT_REQUEST_ERR_MESSAGE } = config.errors;

  describe('exchangeCodeForTokensReq()', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should call axios.post with appropriate arguments', async () => {
      const {
        GRANT_TYPE_AUTH_CODE,
        REDIRECT_URI,
        CLIENT_ID,
        CLIENT_SECRET,
      } = config.oauth;
      const code = 'fake-authorization-code';

      const body = new URLSearchParams({
        grant_type: GRANT_TYPE_AUTH_CODE,
        code,
        redirect_uri: REDIRECT_URI,
      });

      mockedAxiosPost.mockResolvedValueOnce({ success: true });

      const response = await exchangeCodeForTokensReq(code);

      expect(axios.post).toHaveBeenCalledWith(
        'fake-oauth-token-url',
        body,
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
      expect(response).toEqual({
        success: true,
      });
    });

    it('should log error message then throw an instance of RedditRequestError on rejection', async () => {
      const code = 'fake-authorization-code';
      mockedAxiosPost.mockRejectedValueOnce(new Error('Mock exchangeCodeForTokensReq Error'));

      try {
        await exchangeCodeForTokensReq(code);
      } catch (error: unknown) {
        expect(mockedLogRequest).toHaveBeenCalledWith(
          'Error while exchaning code for token',
          'Mock exchangeCodeForTokensReq Error',
        );
        expect(error instanceof RedditRequestError).toBe(true);
        expect((error as any).message).toEqual(REDDIT_REQUEST_ERR_MESSAGE);
      }
    });
  });

  describe('getUserInfo()', () => {
    beforeEach(() => jest.clearAllMocks());
    const accessToken = 'fake-access-token';
    it('should call axios.get with appropriate arguments', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ success: true });

      const { REDDIT_API_BASE_URL } = config.reddit;

      const response = await getUserInfo(accessToken);

      expect(axios.get).toHaveBeenCalledWith(
        `${REDDIT_API_BASE_URL}/api/v1/me`,
        {
          headers: {
            Authorization: 'Bearer fake-access-token',
          },
        },
      );
      expect(response).toEqual({
        success: true,
      });
    });

    it('should throw an instance of RedditRequestError on failure', async () => {
      mockedAxiosGet.mockRejectedValueOnce(new Error('Mock getUserInfo Error'));
      try {
        await getUserInfo(accessToken);
      } catch (error) {
        expect(mockedLogRequest).toHaveBeenCalledWith(
          'Error while making a request to get user info from reddit',
          'Mock getUserInfo Error',
        );
        expect(error instanceof RedditRequestError).toBe(true);
        expect((error as any).message).toEqual(REDDIT_REQUEST_ERR_MESSAGE);
      }
    });
  });
});
