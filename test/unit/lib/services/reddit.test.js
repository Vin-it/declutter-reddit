jest.mock('axios');
jest.mock('config');

const axios = require('axios');

const {
  exchangeCodeForTokensReq,
} = require('../../../../lib/services/reddit');

const { config } = require('../../__mocks__/config');

describe('lib/services/reddit', () => {
  describe('exchangeCodeForTokensReq()', () => {
    it('should call axios.post with appropriate arguments', async () => {
      const {
        GRANT_TYPE_AUTH_CODE,
        REDIRECT_URI,
        CLIENT_ID,
        CLIENT_SECRET,
      } = config.oauth;
      const code = 'fake-authorization-code';

      await exchangeCodeForTokensReq(code);

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
    });
  });
});
