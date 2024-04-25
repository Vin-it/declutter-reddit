import { REDDIT_API_BASE_URL } from '../constants/urls'

/* eslint-disable import/prefer-default-export */
export const getSavedLinks = async (
  user: any,
  { after, before }: { after?: string | null, before?: string | null } = {
    after: null,
    before: null
  }
) => {
  try {
    const response = await fetch(
      `${REDDIT_API_BASE_URL}/user/${user.username}/saved?after=${after}&before=${before}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      }
    )

    if (response.ok) {
      return await response.json()
    }
    throw new Error(`Request Failed, response not ok ${response.status}`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`getSavedLinks: ${error.message}`)
    }
    throw new Error('Error when getting saved links')
  }
}
