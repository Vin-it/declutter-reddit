import { type Request } from 'express';

function setSession(
  req: Request,
  user: { username: string; isImported: boolean; id: number },
  expiresOn: Date | string,
) {
  if (req.session) {
    req.session.user = {
      id: user.id,
      username: user.username,
      expiresOn,
    };
  }
}

export { setSession };
