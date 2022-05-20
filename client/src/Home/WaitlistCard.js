import { Link } from 'wouter';
import { selectors, useWaitlistStore } from '../stateStore';

export function WaitlistCard({ data }) {
  const date = new Date(data.date).toLocaleDateString('es', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="col-span-3 flex border rounded-lg items-center gap-3 w-fit pr-3">
      <Link href={`waitlist/${data._id}`}>
        <img
          className="rounded-tl-lg rounded-bl-lg cursor-pointer"
          src={`https://ui-avatars.com/api/?name=${data.name}&background=random`}
        />
      </Link>
      <div>
        <h3 className="text-md font-medium text-slate-700">
          <Link href={`waitlist/${data._id}`}>{data.name}</Link>
        </h3>
        <small className="text-slate-600">{date}</small>
      </div>
    </div>
  );
}

export function WaitlistCardList() {
  const waitlists = useWaitlistStore(selectors.waitlists);

  return waitlists.length === 0 ? (
    <h1 className="text-slate-500">Nada por aquí...</h1>
  ) : (
    <div className="grid grid-cols-10 gap-1 gap-y-4">
      {waitlists.map((waitlist, i) => (
        <WaitlistCard key={`${waitlist.name}-${i}`} data={waitlist} />
      ))}
    </div>
  );
}
