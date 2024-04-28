import {
  BASE_URL
} from '../constants/urls'


export const getLoggedInUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user`)

    if (response.ok) {
      return await response.json()
    }

    throw new Error(`getLoggedInUser, Request failed with ${response.status}`)
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      throw new Error(`getLoggedInUser error ${error.message}`)
    }
  }
}

export const getSavedLinks = async (
  user: any,
  { after, before }: { after?: string | null, before?: string | null } = {
    after: null,
    before: null
  }
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/saved`,
      {
        method: 'GET',
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

