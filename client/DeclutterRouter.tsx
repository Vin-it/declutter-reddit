import { Route } from 'wouter';
import Browse from './components/Browse/Browse';
import { Home } from './pages/Home/Home';
import { Search } from './pages/Search/Search';
export const DeclutterRouter = () => {
  return (
    <>
      <Route path="/browse">
        <Browse />
      </Route>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
    </>
  );
};

const Hello = () => <h1>Hello, World!</h1>;
