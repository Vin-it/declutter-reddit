jest.mock('config');
jest.mock('../../../../../lib/database/models/User', () => {});
jest.mock('../../../../../lib/services/reddit');
jest.mock('../../../../../lib/utils/debug');
jest.mock('../../../../../lib/queries/users');
jest.mock('../../../../../lib/utils/date');

const { getUserByUsername, updateAccessToken } = require('../../../../../lib/queries/users');
const postLogin = require('../../../../../lib/routes/auth/post-login');
const { refreshAccessToken } = require('../../../../../lib/services/reddit');
const { calcExpiresOn } = require('../../../../../lib/utils/date');
const { logDatabase, logRequest } = require('../../../../../lib/utils/debug');

const { config } = require('../../../__mocks__/config');

describe('lib/routes/auth/post-login', () => {
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
    json: jest.fn(),
  };
  const fakeNext = jest.fn();

  const userId = 'redditUserId';
  const username = 'fakeUsername';
  const accessToken = 'fakeAccessToken';
  const isImported = 1;

  const user = {
    id: userId,
    username,
    access_token: accessToken,
    isImported,
  };

  it('should throw an error if the user is not found in the database', async () => {
    getUserByUsername.mockResolvedValueOnce([]);

    const {
      USER_NOT_FOUND,
    } = config.errors.codes;
    const expectedErrorMessage = 'Incorrect combination of username and password';
    const returnedRes = await postLogin(fakeReq, fakeRes, fakeNext);

    expect(logDatabase).toHaveBeenCalledWith(
      'Error while getting the user',
      expectedErrorMessage,
    );
    expect(returnedRes).toStrictEqual({
      success: false,
    });
    expect(fakeNext).toHaveBeenCalledWith({
      code: USER_NOT_FOUND,
      expose: true,
      message: expectedErrorMessage,
      status: 404,
    });
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
      id: userId,
      username,
      accessToken,
      expiresOn,
      isImported,
    });
    expect(fakeRes.render).toHaveBeenCalledWith('index', {
      user: {
        id: userId,
        username,
        accessToken,
        expiresOn,
        isImported,
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

    const {
      INSERT_FAIL,
    } = config.errors.codes;

    const returnedRes = await postLogin(fakeReq, fakeRes, fakeNext);

    expect(logRequest).toHaveBeenCalledWith(
      'Error while handling expired access token',
      'Failed to insert refreshed access token into the database',
    );
    expect(returnedRes).toStrictEqual({
      success: false,
    });
    expect(fakeNext).toHaveBeenCalledWith({
      code: INSERT_FAIL,
      message: 'Failed to insert refreshed access token into the database',
      expose: false,
      status: 500,
    });
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
        id: userId,
        accessToken: refreshedAT,
        username,
        expiresOn: expectedExpiry,
        isImported,
      },
    });
  });
});
