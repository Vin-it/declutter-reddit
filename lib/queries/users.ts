import { type PartialModelObject } from 'objection'
import { User } from '../database/models'

async function getUserByUsername (username: string, trx = undefined) {
  return await User.query(trx).where('username', username)
}

function updateUser (
  patchClause: PartialModelObject<User>,
  whereClause: Partial<User>
) {
  return User.query().patch(patchClause).where(whereClause)
}

function insertUser ({
  id,
  username,
  refreshToken,
  accessToken,
  expiresOn
}: {
  id: number
  username: string
  refreshToken: string
  accessToken: string
  expiresOn: string | Date
}) {
  return User.query().insert({
    id,
    username,
    refresh_token: refreshToken,
    access_token: accessToken,
    expires_on: expiresOn
  } as unknown as User)
}

export { getUserByUsername, insertUser, updateUser }
