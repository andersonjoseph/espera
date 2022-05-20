import { Route } from 'wouter';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Home } from './Home';
import { Login } from './Login';
import { NewWaitlist } from './NewWaitlist';
import { Waitlist } from './Waitlist';
import { useAuth0 } from '@auth0/auth0-react';
import { Suspense } from 'react';
import { ApiClient } from './api/ApiClient';
import { suspend } from 'suspend-react';
import { selectors, useWaitlistStore } from './stateStore';

function Main() {
  const { getAccessTokenWithPopup } = useAuth0();
  const fetchWaitlists = useWaitlistStore(selectors.fetch);

  suspend(async () => {
    const token = await getAccessTokenWithPopup({
      audience: 'espera-auth',
    });
    new ApiClient(token);

    await fetchWaitlists();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <article className="p-4 px-8 col-span-10">
        <Header />
        <Route path="/">
          <Home />
        </Route>

        <Route path="/new">
          <NewWaitlist />
        </Route>
        <Route path="/waitlist/:id">
          <Waitlist />
        </Route>
      </article>
    </>
  );
}

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App grid grid-cols-12">
      {isAuthenticated ? (
        <Suspense fallback={null}>
          <Main />
        </Suspense>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
