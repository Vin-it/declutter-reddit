import { useState } from 'react';
import { SavedLinks } from '../../utils/reddit-interfaces';
import { useLocation } from 'wouter';
import { SearchResultsWithImages } from './SearchResultsWithImges';

export const Search = () => {
  const [savedLinks] = useState<SavedLinks>(history?.state?.savedLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [, navigate] = useLocation();

  const handleSearchTerm = (value: string) => {
    setSearchTerm(value);
  };

  if (!savedLinks) {
    navigate('/');
  }

  return (
    <div className="dark:bg-slate-400">
      <form className="max-w-md mx-auto">
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
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search title and subreddit names"
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
      {/* {listWithoutImages(savedLinks, searchTerm)} */}
      <SearchResultsWithImages
        savedLinks={savedLinks}
        searchTerm={searchTerm}
      />
    </div>
  );
};

function listWithoutImages(savedLinks: SavedLinks, searchTerm: string) {
  return savedLinks?.children
    .filter(
      (c) =>
        Boolean(
          searchTerm !== '' &&
            (c?.data?.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >
              -1 ||
              c?.data?.subreddit_name_prefixed
                ?.toLowerCase()
                .indexOf(searchTerm.toLowerCase()) > -1)
        ) || Boolean(searchTerm === '')
    )
    .map((c, i) => {
      return (
        <div key={i} className="m-3">
          <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {c.data.subreddit_name_prefixed}
            </p>
            <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <div>{c?.data?.title}</div>
            </h6>
          </div>
        </div>
      );
    });
}
