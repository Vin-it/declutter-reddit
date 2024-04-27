import { useState } from 'react';
import { CustomButton } from '../../components/Buttons/Buttons';
import { SavedLinks } from '../../utils/reddit-interfaces';
import { getSavedLinks } from '../../api/reddit';
import { getLoggedInUser } from '../../api/declutter-reddit-api';
import { delay } from '../../utils/general.utils';
import { useLocation } from 'wouter';

export const Home = () => {
  const [, navigate] = useLocation();
  const [user, setUser] = useState({
    username: '',
  });
  const [savedLinks, setSavedLinks] = useState<SavedLinks | undefined>();
  const handleSearchWithoutImport = async () => {
    const { data: userData } = await getLoggedInUser();
    let tempSavedLinks: SavedLinks | null = null;
    let response = await getSavedLinks(userData.user);
    tempSavedLinks = response.data;

    while (response?.data?.after) {
      await delay(700);
      response = await getSavedLinks(userData.user, {
        after: response.data.after,
      });
      tempSavedLinks?.children.push(...response?.data?.children);
    }

    if (tempSavedLinks) {
      navigate('/search', { state: { savedLinks: tempSavedLinks } });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-400">
      <div className="m-auto">
        <div
          style={{ width: '48rem' }}
          className="h-30 grid grid-cols-2 divide-x font-mono text-sm text-center font-bold leading-6 rounded-lg shadow-lg overflow-hidden dark:divide-slate-700"
        >
          <div className="p-4 text-slate-400 bg-white dark:bg-slate-800">
            <CustomButton text={'import and search'} />
            <br />
            We store the saved links on our server. This way you can come back
            anytime and have your data ready for searching. You can always
            delete it with one click.
          </div>
          <div className="p-4 text-slate-400 bg-white dark:bg-slate-800">
            <CustomButton
              onClick={handleSearchWithoutImport}
              text={'search without import'}
            />
            <br />
            We will not store your saved links. Everytime you visit the website
            we will fetch it and store it only in the browser.
          </div>
        </div>
      </div>
    </div>
  );
};
