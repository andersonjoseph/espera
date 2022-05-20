import { WaitlistCardList } from './WaitlistCard';
import { Suspense } from 'react';

export function Home() {
  return (
    <section>
      <h2 className="text-md font-medium text-slate-700 mb-5">Waitlists</h2>
      <Suspense fallback={null}>
        <WaitlistCardList />
      </Suspense>
    </section>
  );
}
