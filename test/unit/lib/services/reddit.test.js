jest.mock('axios');
jest.mock('config');
jest.mock('../../../../lib/utils/debug');

const axios = require('axios');

const {
  exchangeCodeForTokensReq,
} = require('../../../../lib/services/reddit');
const { logRequest } = require('../../../../lib/utils/debug');
const { RedditRequestError } = require('../../../../lib/utils/error-types');

const { config } = require('../../__mocks__/config');

describe('lib/services/reddit', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('exchangeCodeForTokensReq()', () => {
    it('should call axios.post with appropriate arguments', async () => {
      const {
        GRANT_TYPE_AUTH_CODE,
        REDIRECT_URI,
        CLIENT_ID,
        CLIENT_SECRET,
      } = config.oauth;
      const code = 'fake-authorization-code';

      axios.post.mockResolvedValueOnce({ success: true });

      const response = await exchangeCodeForTokensReq(code);

      expect(axios.post).toHaveBeenCalledWith(
        'fake-oauth-token-url',
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
      expect(response).toEqual({
        success: true,
      });
    });

    it('should log error message then throw an instance of RedditRequestError on rejection', async () => {
      const code = 'fake-authorization-code';
      const { REDDIT_REQUEST_ERR_MESSAGE } = config.errors;
      axios.post.mockRejectedValueOnce(new Error('Mock error'));

      try {
        await exchangeCodeForTokensReq(code);
      } catch (error) {
        expect(logRequest).toHaveBeenCalledWith(
          'Error while exchaning code for token',
          'Mock error',
        );
        expect(error instanceof RedditRequestError).toBe(true);
        expect(error.message).toEqual(REDDIT_REQUEST_ERR_MESSAGE);
      }
    });
  });
});
