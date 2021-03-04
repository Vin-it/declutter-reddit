jest.mock('config', () => {});
jest.mock('../../../../../lib/services/reddit');
jest.mock('../../../../../lib/utils/debug');
jest.mock('../../../../../lib/utils/date');
jest.mock('../../../../../lib/queries/users');

const { insertUserIfNotExist } = require('../../../../../lib/queries/users');
const { exchangeCodeForTokensReq, getUserInfo } = require('../../../../../lib/services/reddit');
const { calcExpiresOn } = require('../../../../../lib/utils/date');
const { logDatabase, logRequest } = require('../../../../../lib/utils/debug');

const getRedirect = require('../../../../../lib/routes/auth/get-redirect');

describe('lib/routes/auth/get-redirect', () => {
  const fakeReq = {
    query: {
      state: 'fakeState',
      code: 'fakeCode',
    },
    session: {},
  };
  const fakeRes = {
    status: jest.fn(() => fakeRes),
    json: jest.fn(),
    send: jest.fn(),
    render: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call render method', async () => {
    const expectedDate = new Date();

    exchangeCodeForTokensReq.mockResolvedValueOnce({
      data: {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        expires_in: 3600,
      },
    });
    insertUserIfNotExist.mockResolvedValueOnce(1);
    getUserInfo.mockResolvedValueOnce({
      data: { name: 'fakeUsername' },
    });
    calcExpiresOn.mockReturnValueOnce(expectedDate);

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

  it('should catch an error, log it, and respond with 400 status code', async () => {
    const expectedError = new Error('Exchange code for token failed!');
    exchangeCodeForTokensReq.mockRejectedValueOnce(expectedError);

    await getRedirect(fakeReq, fakeRes);

    expect(logRequest).toHaveBeenCalledWith('getRedirect error: Exchange code for token failed!');
    expect(fakeRes.status).toHaveBeenCalledWith(400);
    expect(fakeRes.status().send).toHaveBeenCalledWith({ success: false });
  });
});
