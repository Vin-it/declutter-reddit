import { useEffect, useState } from 'react';

import SavedLink from './SavedLink/SavedLink';

import { getLoggedInUser } from '../api/declutter-reddit-api';
import { getSavedLinks } from '../api/reddit';
import { REDDIT_LISTING_KIND } from '../constants/app';
import { SavedLinks } from '../utils/reddit-interfaces';

function Main() {
  const [user, setUser] = useState({
    username: '',
  });
  const [savedLinks, setSavedLinks] = useState<SavedLinks | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getComponentData = async () => {
      setIsLoading(true);
      const { data: userData } = await getLoggedInUser();
      const { data: savedLinksRes } = await getSavedLinks(userData.user);
      setUser(userData.user);
      setSavedLinks(savedLinksRes);
      setIsLoading(false);
    };
    try {
      getComponentData();
    } catch (err: unknown) {
      console.log(err);
      setError('Trouble while loading data');
    }
  }, []);

  const handlePrevious = async () => {
    const firstPost = savedLinks?.children[0];
    const before = `${firstPost?.kind}_${firstPost?.data.id}`;
    const { data: savedLinkRes } = await getSavedLinks(user, { before });
    setSavedLinks(savedLinkRes);
  };

  const handleNext = async () => {
    const { after } = savedLinks ?? {};
    const { data: savedLinksRes } = await getSavedLinks(user, { after });
    setSavedLinks(savedLinksRes);
  };

  if (error) {
    return <div>Something went wrong!!</div>;
  }

  if (isLoading) {
    return <>Loading..</>;
  }

  return (
    <>
      <h3>{`Welcome, ${user.username}`}</h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}
      >
        {savedLinks?.children.map((child) => (
          <SavedLink data={child.data} key={child.data.id} />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button type="button" onClick={handlePrevious}>
          Previous
        </button>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );
}

export default Main;
