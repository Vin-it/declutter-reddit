jest.mock('../../../../../lib/database/models/User', () => {});
jest.mock('../../../../../lib/services/reddit');
jest.mock('../../../../../lib/utils/debug');
jest.mock('../../../../../lib/utils/date');
jest.mock('../../../../../lib/queries/users');

const { updateUser, getUserByUsername } = require('../../../../../lib/queries/users');
const { exchangeCodeForTokensReq, getUserInfo } = require('../../../../../lib/services/reddit');
const { calcExpiresOn } = require('../../../../../lib/utils/date');
const { logRequest } = require('../../../../../lib/utils/debug');

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
    redirect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TODO: should call redirect method when user does not already exist

  it('should call redirect method when user already exists', async () => {
    const expectedDate = new Date();
    const tokenData = {
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
      expires_in: 3600,
    };
    const user = {
      id: '1',
      name: 'username',
      ...tokenData,
    };

    exchangeCodeForTokensReq.mockResolvedValueOnce({
      data: tokenData,
    });
    getUserByUsername.mockResolvedValue([user]);
    updateUser.mockResolvedValueOnce(1);
    getUserInfo.mockResolvedValueOnce({
      data: { name: 'fakeUsername' },
    });
    calcExpiresOn.mockReturnValueOnce(expectedDate);

    await getRedirect(fakeReq, fakeRes);

    expect(exchangeCodeForTokensReq).toHaveBeenCalledWith('fakeCode');
    expect(calcExpiresOn).toHaveBeenCalledWith(3600);
    expect(getUserInfo).toHaveBeenCalledWith('accessToken');
    expect(fakeRes.redirect).toHaveBeenCalledWith('/');
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
