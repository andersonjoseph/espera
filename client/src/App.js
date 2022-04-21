import { Route } from 'wouter';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Home } from './Home';
import { NewWaitlist } from './NewWaitlist';
import { Waitlist } from './Waitlist';

function App() {
  return (
    <div className="App grid grid-cols-12">
      <Sidebar />

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
    </div>
  );
}

export default App;
