import { renderImage } from '../../components/SavedLink/SavedLink';
import { searchSavedLinkChild } from '../../utils/general.utils';
import { SavedLinks } from '../../utils/reddit-interfaces';

export const SearchResultsWithImages = ({
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
              <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                {renderImage(c.data)}
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {c?.data?.title ?? c?.data?.link_title}
                  </h6>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {c.data.subreddit_name_prefixed}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};
