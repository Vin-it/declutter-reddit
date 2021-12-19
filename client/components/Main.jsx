import { useEffect, useState } from 'react';

import SavedLink from './SavedLink/SavedLink';

import { getLoggedInUser } from '../api/declutter-reddit-api';
import { getSavedLinks } from '../api/reddit';
import { REDDIT_LISTING_KIND } from '../constants/app';

function Main() {
  const [user, setUser] = useState({
    username: '',
  });
  const [savedLinks, setSavedLinks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    try {
      setIsLoading(true);
      const { data: userData } = await getLoggedInUser();
      const { data: savedLinksRes } = await getSavedLinks(userData.user);
      setUser(userData.user);
      setSavedLinks(savedLinksRes);
      setIsLoading(false);
    } catch (err) {
      setError(err);
    }
  }, []);

  const handlePrevious = async () => {
    const firstPost = savedLinks.children[0];
    const before = `${firstPost.kind}_${firstPost.id}`;
    const { data: savedLinkRes } = await getSavedLinks(user, { before });
    setSavedLinks(savedLinkRes);
  };

  const handleNext = async () => {
    const { after } = savedLinks;
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
      <h1>{`Welcome, ${user.username}`}</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: 'center',
      }}
      >
        {savedLinks?.children.map((child) => (
          <SavedLink
            key={child.data.id}
            title={
              child.kind === REDDIT_LISTING_KIND.T1
                ? child.data.link_title
                : child.data.title
            }
            thumbnail={child.data.thumbnail}
          />
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
      >
        <button type="button" onClick={handlePrevious}>Previous</button>
        <button type="button" onClick={handleNext}>Next</button>
      </div>
    </>
  );
}

export default Main;
