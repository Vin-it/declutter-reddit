import { type Request } from 'express'

function setSession (
  req: Request,
  user: { username: string, isImported: boolean, id: number },
  accessToken: string,
  expiresOn: Date | string
) {
  if (req.session) {
    req.session.user = {
      id: user.id,
      username: user.username,
      isImported: user.isImported,
      accessToken,
      expiresOn
    }
  }
}

export { setSession }
