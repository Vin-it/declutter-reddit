jest.mock('axios');
jest.mock('../../../../../lib/services/reddit');
jest.mock('../../../../../lib/utils/debug');
jest.mock('../../../../../lib/utils/date');
jest.mock('../../../../../lib/queries/users');
jest.mock('../../../../../lib/constants/oauth');

const { insertUserIfNotExist } = require('../../../../../lib/queries/users');
const getRedirect = require('../../../../../lib/routes/auth/get-redirect');
const { exchangeCodeForTokensReq, getUserInfo } = require('../../../../../lib/services/reddit');
const { calcExpiresOn } = require('../../../../../lib/utils/date');
const { logDatabase } = require('../../../../../lib/utils/debug');

describe('lib/routes/auth/get-redirect', () => {
  const fakeReq = {
    query: {
      state: 'fakeState',
      code: 'fakeCode',
    },
    session: {},
  };
  const fakeRes = {
    status: () => ({
      json: jest.fn(),
      send: jest.fn(),
    }),
    render: jest.fn(),
  };
  it('should call render method', async () => {
    const expectedDate = new Date();
    exchangeCodeForTokensReq.mockResolvedValue({
      data: {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        expires_in: 3600,
      },
    });
    insertUserIfNotExist.mockResolvedValue(1);
    getUserInfo.mockResolvedValue({
      data: { name: 'fakeUsername' },
    });
    calcExpiresOn.mockReturnValue(expectedDate);
    await getRedirect(fakeReq, fakeRes);

    expect(exchangeCodeForTokensReq).toHaveBeenCalledWith('fakeCode');
    expect(calcExpiresOn).toHaveBeenCalledWith(3600);
    expect(getUserInfo).toHaveBeenCalledWith('accessToken');
    expect(logDatabase).not.toHaveBeenCalled();
    expect(fakeRes.render).toHaveBeenCalledWith('index', {
      user: {
        accessToken: 'accessToken',
        expiresOn: expectedDate,
        refreshToken: 'refreshToken',
        username: 'fakeUsername',
      },
    });
  });
});
