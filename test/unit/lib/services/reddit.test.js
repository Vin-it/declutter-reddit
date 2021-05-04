jest.mock('axios');
jest.mock('config');
jest.mock('../../../../lib/utils/debug');

const axios = require('axios');

const {
  exchangeCodeForTokensReq,
  getUserInfo,
} = require('../../../../lib/services/reddit');
const { logRequest } = require('../../../../lib/utils/debug');
const { RedditRequestError } = require('../../../../lib/utils/error-types');

const { config } = require('../../__mocks__/config');

describe('lib/services/reddit', () => {
  beforeEach(() => jest.clearAllMocks());

  const { REDDIT_REQUEST_ERR_MESSAGE } = config.errors;

  describe('exchangeCodeForTokensReq()', () => {
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

      axios.post.mockResolvedValueOnce({ success: true });

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
      axios.post.mockRejectedValueOnce(new Error('Mock exchangeCodeForTokensReq Error'));

      try {
        await exchangeCodeForTokensReq(code);
      } catch (error) {
        expect(logRequest).toHaveBeenCalledWith(
          'Error while exchaning code for token',
          'Mock exchangeCodeForTokensReq Error',
        );
        expect(error instanceof RedditRequestError).toBe(true);
        expect(error.message).toEqual(REDDIT_REQUEST_ERR_MESSAGE);
      }
    });
  });

  describe('getUserInfo()', () => {
    const accessToken = 'fake-access-token';
    it('should call axios.get with appropriate arguments', async () => {
      axios.get.mockResolvedValueOnce({ success: true });

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
      axios.get.mockRejectedValueOnce(new Error('Mock getUserInfo Error'));
      try {
        await getUserInfo(accessToken);
      } catch (error) {
        expect(logRequest).toHaveBeenCalledWith(
          'Error while making a request to get user info from reddit',
          'Mock getUserInfo Error',
        );
        expect(error instanceof RedditRequestError).toBe(true);
        expect(error.message).toEqual(REDDIT_REQUEST_ERR_MESSAGE);
      }
    });
  });
});
