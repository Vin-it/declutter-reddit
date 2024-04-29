import config from 'config';

import { getUserByUsername, updateUser } from '../../queries/users';
import { refreshAccessToken } from '../../services/reddit';
import { calcExpiresOn } from '../../utils/date';
import { logDatabase, logRequest } from '../../utils/debug';
import { setSession } from '../../utils/set-session';
import makeError from '../../utils/make-error';
import { NextFunction, Request, Response } from 'express';
import errors from '../../constants/errors';

const { USER_NOT_FOUND, INSERT_FAIL } =
  config.get<(typeof errors)['codes']>('errors.codes');

// TODO: move this to a different more appropriate location
async function handleExpiredAccessToken(username: string) {
  const [user] = await getUserByUsername(username);
  const response = await refreshAccessToken(user.refresh_token);
  const expiresOn = calcExpiresOn(response.data.expires_in);

  const updatedToken = await updateUser(
    {
      access_token: response.data.access_token,
      expires_on: expiresOn,
    },
    {
      username,
    },
  );

  if (!updatedToken) {
    const error = makeError({
      message: 'Failed to insert refreshed access token into the database',
      status: 500,
      expose: false,
      code: INSERT_FAIL,
    });

    throw error;
  }

  return { response, expiresOn };
}

async function handleGetUser(username: string) {
  const [user] = await getUserByUsername(username);

  if (!user) {
    const error = makeError({
      message: 'Incorrect combination of username and password',
      status: 404,
      code: USER_NOT_FOUND,
      expose: true,
    });

    throw error;
  }

  return user;
}

async function postLogin(req: Request, res: Response, next: NextFunction) {
  const { username } = req.body;

  let user = null;

  try {
    user = await handleGetUser(username);
  } catch (error) {
    if (error instanceof Error) {
      logDatabase('Error while getting the user', error.message);
    }
    next(error);
    return { success: false };
  }

  const isTokenExpired = new Date(user.expires_on) < new Date();

  if (!isTokenExpired) {
    setSession(
      req,
      {
        id: user.id,
        username: user.username,
        isImported: user.isImported,
      },
      user.expires_on,
    );
  } else {
    try {
      const { expiresOn } = await handleExpiredAccessToken(username);
      setSession(req, user, expiresOn);
    } catch (error) {
      if (error instanceof Error) {
        logRequest('Error while handling expired access token', error.message);
      }
      next(error);
      return { success: false };
    }
  }
  res.render('index', { user: req.session.user });
  return { success: true };
}

export { postLogin, handleExpiredAccessToken };
