jest.mock('axios');
jest.mock('../../../../../lib/services/reddit');
jest.mock('../../../../../lib/utils/debug');
jest.mock('../../../../../lib/utils/date');

const getRedirect = require('../../../../../lib/routes/auth/get-redirect');
const { exchangeCodeForTokensReq } = require('../../../../../lib/services/reddit');
const { calcExpiresOn } = require('../../../../../lib/utils/date');
const { logRequest } = require('../../../../../lib/utils/debug');

describe('lib/routes/auth/get-redirect', () => {
  const fakeReq = {
    query: {
      state: 'fakeState',
      code: 'fakeCode',
    },
  };
  const fakeRes = {
    status: () => ({
      json: jest.fn(),
      send: jest.fn(),
    }),
  };
  it('should call render method', async () => {
    exchangeCodeForTokensReq.mockResolvedValue({
      data: {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        expires_in: 3600,
      },
    });
    await getRedirect(fakeReq, fakeRes);

    expect(exchangeCodeForTokensReq).toHaveBeenCalledWith('fakeCode');
    expect(calcExpiresOn).toHaveBeenCalledWith(3600);
  });
});
