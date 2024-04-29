import {
  getRedditLink,
  getSubredditLink,
  searchSavedLinkChild,
} from '../../utils/general.utils';
import { SavedLinks } from '../../utils/reddit-interfaces';

export const SearchResultsWithoutImages = ({
  savedLinks,
  searchTerm,
}: {
  savedLinks: SavedLinks;
  searchTerm: string;
}) => {
  return (
    <>
      {savedLinks?.children
        .filter((c) => searchSavedLinkChild(c, searchTerm))
        .map((c, i) => {
          return (
            <div key={i} className="m-3">
              <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <a
                    target="_blank"
                    href={getSubredditLink(c?.data?.subreddit_name_prefixed)}
                  >
                    {c.data.subreddit_name_prefixed}
                  </a>
                </p>
                <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <div>
                    <a target="_blank" href={getRedditLink(c?.data?.permalink)}>
                      {c?.data?.title ?? c?.data?.link_title}
                    </a>
                  </div>
                </h6>
              </div>
            </div>
          );
        })}
    </>
  );
};
