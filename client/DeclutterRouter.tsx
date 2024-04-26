import { Route } from 'wouter';
import Browse from './components/Browse/Browse';
export const DeclutterRouter = () => {
  return (
    <>
      <Route path="/browse">
        <Browse />
      </Route>
      <Route path="/"></Route>
    </>
  );
};

const Hello = () => <h1>Hello, World!</h1>;
