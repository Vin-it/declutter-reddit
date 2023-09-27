import {
  BASE_URL,
} from '../constants/urls';

/* eslint-disable import/prefer-default-export */
export const getLoggedInUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user`);

    if (response.ok) {
      return response.json();
    }

    throw new Error(`getLoggedInUser, Request failed with ${response.status}`);
  } catch (error: unknown) {
    if (typeof error === 'object' &&  error !== null && 'message' in error) {
      throw new Error(`getLoggedInUser error ${error.message}`);
    }
    
  }
};
