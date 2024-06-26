import { SavedLinks } from './reddit-interfaces';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function searchSavedLinkChild(
  c: SavedLinks['children'][0],
  searchTerm: string,
): Boolean {
  return (
    Boolean(
      searchTerm !== '' &&
        (c?.data?.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          c?.data?.subreddit_name_prefixed
            ?.toLowerCase()
            .indexOf(searchTerm.toLowerCase()) > -1),
    ) || Boolean(searchTerm === '')
  );
}

export const getRedditLink = (permalink: string) => {
  return `https://reddit.com${permalink}`;
};

export const getSubredditLink = (subreddit_name_prefixed: string) => {
  return `https://reddit.com/${subreddit_name_prefixed}`;
};
