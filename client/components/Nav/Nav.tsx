import { useLocation } from 'wouter';

export const Nav = () => {
  const [location] = useLocation();

  return (
    <nav className="border-gray-200">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-black">
            declutter
          </span>
        </a>
        <button
          id="collapse-button"
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 focus:outline-none md:hidden dark:text-gray-400"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5 text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="mt-4 flex flex-col rounded-lg bg-gray-50 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-transparent">
            <li>
              <a
                href="/"
                className="block rounded px-3 py-2 text-center text-white hover:bg-gray-100 hover:text-white md:border-0 md:p-0 md:text-gray-900 md:hover:bg-transparent dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="block rounded px-3 py-2 text-center text-white hover:bg-gray-100 hover:text-white md:border-0 md:p-0 md:text-gray-900 md:hover:bg-transparent dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                about
              </a>
            </li>
            {location === '/login' ? null : (
              <li>
                <a
                  href="/logout"
                  className="block rounded px-3 py-2 text-center text-white hover:bg-gray-100 hover:text-white md:border-0 md:p-0 md:text-gray-900 md:hover:bg-transparent dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
