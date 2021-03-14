jest.mock('config', () => {});
jest.mock('../../../../../lib/database/models/User', () => {});
jest.mock('../../../../../lib/services/reddit');
jest.mock('../../../../../lib/queries/users');
jest.mock('../../../../../lib/utils/date');

const { getUserByUsername, updateAccessToken } = require('../../../../../lib/queries/users');
const postLogin = require('../../../../../lib/routes/auth/post-login');
const { refreshAccessToken } = require('../../../../../lib/services/reddit');
const { calcExpiresOn } = require('../../../../../lib/utils/date');

describe('lib/routes/auth', () => {
  beforeEach(() => jest.clearAllMocks());

  const fakeReq = {
    body: {
      username: 'fakeUsername',
    },
    session: {},
  };
  const fakeRes = {
    render: jest.fn(),
    status: jest.fn(() => fakeRes),
    send: jest.fn(),
  };

  const username = 'fakeUsername';
  const accessToken = 'fakeAccessToken';

  const user = {
    username,
    access_token: accessToken,
  };

  it('should throw an error if the user is not found in the database', async () => {
    getUserByUsername.mockResolvedValueOnce([]);

    try {
      await postLogin(fakeReq, fakeRes);
    } catch (error) {
      expect(error.message).toBe('Incorrect combination of username and password');
      expect(error.status).toBe(400);
    }

    expect.assertions(2);
  });

  it('should call render, and set session - if AT in db is not expired', async () => {
    const expiresOn = new Date().getTime() + 3600;
    user.expires_on = expiresOn;

    getUserByUsername.mockResolvedValueOnce([
      user,
    ]);
    await postLogin(fakeReq, fakeRes);

    expect(getUserByUsername).toHaveBeenCalledWith('fakeUsername');
    expect(fakeReq.session.user).toStrictEqual({
      username,
      accessToken,
      expiresOn,
    });
    expect(fakeRes.render).toHaveBeenCalledWith('index', {
      user: {
        username,
        accessToken,
        expiresOn,
      },
    });
  });

  it('throw an error if updating user returns non-1 result', async () => {
    const refreshedAT = 'refreshedAccessToken';
    const expiredDate = new Date().getTime() - 3600;
    user.expires_on = expiredDate;

    getUserByUsername.mockResolvedValueOnce([
      user,
    ]);
    refreshAccessToken.mockResolvedValueOnce({
      data: {
        expires_in: 3600,
        access_token: refreshedAT,
      },
    });
    updateAccessToken.mockResolvedValueOnce(0);

    try {
      await postLogin(fakeReq, fakeRes);
    } catch (error) {
      expect(error.message).toBe('Failed to insert refreshed access token into the database');
      expect(error.status).toBe(400);
    }
  });

  it('should refresh AT if expired, update AT in db, set user in session, and call render', async () => {
    const refreshedAT = 'refreshedAccessToken';
    const expiredDate = new Date().getTime() - 3600;
    const expectedExpiry = new Date();
    user.expires_on = expiredDate;

    getUserByUsername.mockResolvedValueOnce([
      user,
    ]);
    refreshAccessToken.mockResolvedValueOnce({
      data: {
        expires_in: 3600,
        access_token: refreshedAT,
      },
    });
    updateAccessToken.mockResolvedValueOnce(1);
    calcExpiresOn.mockReturnValueOnce(expectedExpiry);

    await postLogin(fakeReq, fakeRes);

    expect(getUserByUsername).toHaveBeenCalledWith(username);
    expect(refreshAccessToken).toHaveBeenCalledWith(user);
    expect(updateAccessToken).toHaveBeenCalledWith(refreshedAT, expectedExpiry, username);
    expect(fakeReq.session).toStrictEqual({
      user: {
        accessToken: refreshedAT,
        username,
        expiresOn: expectedExpiry,
      },
    });
  });
});
