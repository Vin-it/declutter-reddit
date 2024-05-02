import { Route } from 'wouter';
import Browse from './components/Browse/Browse';
import { Home } from './pages/Home/Home';
import { Search } from './pages/Search/Search';
import { LoginPage } from './pages/Login/Login.page';
export const DeclutterRouter = () => {
  return (
    <>
      <Route path="/login">
        <LoginPage />
      </Route>
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
