import { useEffect, useState } from 'react';
import { getLoggedInUser } from '../api/declutter-reddit-api';
import { getSavedLinks } from '../api/reddit';

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
      const { data } = await getLoggedInUser();
      setUser(data.user);
      setIsLoading(false);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(async () => {
    if (user.username) {
      try {
        setIsLoading(true);
        const { data } = await getSavedLinks(user);
        setSavedLinks(data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
      }
    }
  }, [user]);

  if (error) {
    return <div>Something went wrong!!</div>;
  }

  if (isLoading) {
    return <>Loading..</>;
  }

  return (
    <>
      <h1>{`Welcome, ${user.username}`}</h1>
      <div>
        {
          savedLinks?.children.map((child) => (
            <div key={child.data.id}>
              <li>
                {child.data.title}
                <div>
                  {(child?.data?.thumbnail !== 'self' && child?.data?.thumbnail !== 'default')
                    ? <img src={child?.data?.thumbnail} alt="preview" />
                    : null}
                </div>
              </li>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default Main;
