import { Route } from 'wouter';
import Browse from './components/Browse/Browse';
import { Home } from './pages/Home/Home';
export const DeclutterRouter = () => {
  return (
    <>
      <Route path="/browse">
        <Browse />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </>
  );
};

const Hello = () => <h1>Hello, World!</h1>;
