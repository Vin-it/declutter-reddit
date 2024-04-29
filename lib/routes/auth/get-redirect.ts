import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import User from '../../database/models/User';
import { getUserByUsername, updateUser, insertUser } from '../../queries/users';
import {
  exchangeCodeForTokensReq,
  getUserInfo,
  Tokens,
} from '../../services/reddit';
import { calcExpiresOn } from '../../utils/date';
import { logRequest } from '../../utils/debug';
import { setSession } from '../../utils/set-session';

export default async function getRedirect(req: Request, res: Response) {
  let user;
  let tokens: AxiosResponse<Tokens> | null = null;
  const { state, code } = req.query;

  try {
    if (state && code) {
      tokens = await exchangeCodeForTokensReq(String(code));
    }

    if (tokens) {
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = tokens.data;

      const expiresOn = calcExpiresOn(expiresIn);

      const { data: fetchedUser } = await getUserInfo(accessToken);

      const userExists = await getUserByUsername(fetchedUser.name);

      user = {
        id: fetchedUser.id,
        username: fetchedUser.name,
        accessToken,
        refreshToken,
        expiresOn,
      };

      let updatedUser: null | number = null;
      let insertedUser: null | User | User[] = null;

      if (userExists.length === 1) {
        updatedUser = await updateUser(
          {
            expires_on: expiresOn,
            access_token: accessToken,
            refresh_token: refreshToken,
          },
          { id: fetchedUser.id, username: fetchedUser.name },
        );
      } else if (userExists.length === 0) {
        insertedUser = await insertUser(user);
      } else {
        throw new Error(
          'User array did not match 0 (user did not exist) or 1 (exactly one user exists)',
        );
      }

      // TODO: if user already exists revoke the token first

      if (updatedUser || insertedUser) {
        setSession(
          req,
          {
            ...user,
            isImported: userExists.length
              ? userExists[0].isImported
              : insertedUser
                ? insertedUser.isImported
                : false,
          },
          accessToken,
          expiresOn,
        );

        res.redirect('/');
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logRequest(`getRedirect error: ${error.message}`);
    }
    res.status(400).send({
      success: false,
    });
  }
}
