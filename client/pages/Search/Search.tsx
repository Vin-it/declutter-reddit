import { useState } from 'react';
import { SavedLinks } from '../../utils/reddit-interfaces';
import { useLocation } from 'wouter';
import { SearchResultsWithImages } from './SearchResultsWithImges';
import { SearchResultsWithoutImages } from './SearchResultsWithoutImages';

export const Search = () => {
  const [savedLinks] = useState<SavedLinks>(history?.state?.savedLinks);
  const [withImages, setWithImages] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [, navigate] = useLocation();

  const handleSearchTerm = (value: string) => {
    setSearchTerm(value);
  };

  if (!savedLinks) {
    navigate('/');
  }

  return (
    <div className="py-3">
      <div className="flex flex-row justify-center gap-9">
        <form className="">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => handleSearchTerm(e.target.value)}
              type="search"
              id="default-search"
              className="block w-72 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search title and subreddit names"
              required
            />
          </div>
        </form>
        <div className="flex items-center">
          <input
            checked={withImages}
            onClick={() => {
              setWithImages(!withImages);
            }}
            id="checked-checkbox"
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="checked-checkbox"
            className="ms-2 text-md font-medium"
          >
            Checked state
          </label>
        </div>
      </div>
      {withImages ? (
        <SearchResultsWithImages
          savedLinks={savedLinks}
          searchTerm={searchTerm}
        />
      ) : (
        <SearchResultsWithoutImages
          savedLinks={savedLinks}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};
