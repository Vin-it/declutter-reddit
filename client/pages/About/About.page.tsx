import { Nav } from '../../components/Nav/Nav';

export const AboutPage = () => {
  return (
    <>
      <Nav />
      <div className="mx:px-0 flex flex-col flex-wrap content-center justify-center px-3">
        <div className="mt-10 max-w-2xl">
          <h1 className="text-center font-serif text-4xl">about declutter</h1>
          <p className="mt-10">
            I started this as a hobby project during my college days. I am
            reviving it now because I want to work on a side project. If people
            find it useful I will continue working on it otherwise I give it a
            year of maintenance and improvements from now. That should put the
            date to May 2025 when I will re-evaluate this.
          </p>
          <p className="mt-2">
            If you have used it and liked it, let me know at
            decluttereddit@gmail.com! Or perhaps you used and would like it to
            be different, let me know too. I will actually reply and add those
            suggestions.
          </p>
        </div>
      </div>
    </>
  );
};
