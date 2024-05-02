import { useState } from 'react';
import { CustomButton } from '../../components/Buttons/Buttons';
import { SavedLinks } from '../../utils/reddit-interfaces';
import { getLoggedInUser, getSavedLinks } from '../../api/declutter-reddit-api';
import { delay } from '../../utils/general.utils';
import { useLocation } from 'wouter';
import { Nav } from '../../components/Nav/Nav';

export const Home = () => {
  const [, navigate] = useLocation();
  const [count, setCount] = useState(0);
  const handleSearchWithoutImport = async () => {
    const { data: userData } = await getLoggedInUser();
    let tempSavedLinks: SavedLinks | null = null;
    let response = await getSavedLinks(userData.user);
    tempSavedLinks = response.data;

    while (response?.data?.after) {
      setCount(tempSavedLinks?.children.length ?? 0);
      await delay(700);
      response = await getSavedLinks(userData.user, {
        after: response.data.after,
      });
      tempSavedLinks?.children.push(...response.data.children);
    }

    if (tempSavedLinks) {
      navigate('/search', { state: { savedLinks: tempSavedLinks } });
    }
  };

  return (
    <>
      <Nav />
      <div className="mt-32 flex justify-center bg-slate-50 dark:bg-slate-400">
        <div>
          <div className="h-30 grid grid-cols-1 divide-x overflow-hidden rounded-lg text-center font-mono text-sm font-bold leading-6 shadow-lg dark:divide-slate-700">
            <div className="bg-white p-4 text-slate-400 dark:bg-slate-800">
              <CustomButton
                onClick={handleSearchWithoutImport}
                text={'Click here to start'}
              />
              <br />
              {count === 0 ? (
                <ul className="text-left">
                  <li>
                    - We never save your data on our server. It all stays in
                    your browser.
                  </li>
                  <li>
                    - One you leave the search page you will have to start
                    again. (But you can refresh it)
                  </li>
                  <li>
                    - You can report bugs or request features at -
                    decluttereddit@gmail.com
                  </li>
                </ul>
              ) : (
                `Loaded ${count} results...`
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
