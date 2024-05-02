import { Nav } from '../../components/Nav/Nav';

export const LoginPage = () => {
  return (
    <>
      <Nav />
      <div className="mt-32 flex w-screen justify-center text-center">
        <h1 className="block font-serif text-3xl">
          search your saved reddit posts with ease
        </h1>
      </div>
      <div className="my-20 flex bg-slate-50 dark:bg-slate-400">
        <div className="m-auto">
          <a
            href={`https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_APP_CLIENT_ID}&response_type=code&state=dalsdkakd&redirect_uri=${process.env.REDDIT_APP_REDIRECT_URI}&duration=permanent&scope=identity,history,read`}
          >
            <div className="cursor-pointer overflow-hidden rounded-b-md bg-white p-5 text-center font-mono font-bold leading-6 text-slate-400 shadow-lg hover:shadow-none dark:divide-slate-700 dark:bg-slate-800">
              LOGIN WITH REDDIT
            </div>
          </a>
        </div>
      </div>
    </>
  );
};
