import {
  REDDIT_API_BASE_URL,
} from '../constants/urls';

/* eslint-disable import/prefer-default-export */
export const getSavedLinks = async (user) => {
  try {
    const response = await fetch(`${REDDIT_API_BASE_URL}/user/${user.username}/saved`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Request Failed, response not ok ${response.status}`);
  } catch (error) {
    throw new Error(`getSavedLinks: ${error.message}`);
  }
};
