import { WaitlistCardList } from './WaitlistCard';

export function Home() {
  return (
    <section>
      <h2 className="text-md font-medium text-slate-700 mb-5">Waitlists</h2>
      <WaitlistCardList />
    </section>
  );
}
