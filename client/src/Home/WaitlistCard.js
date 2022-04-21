import { Link } from 'wouter';

export function WaitlistCard() {
  return (
    <div className="col-span-3 flex border rounded-lg items-center gap-3 w-fit pr-3">
      <Link href="waitlist/1">
        <img
          className="rounded-tl-lg rounded-bl-lg cursor-pointer"
          src="https://ui-avatars.com/api/?name=test&background=random"
        />
      </Link>
      <div>
        <h3 className="text-md font-medium text-slate-700">
          <Link href="waitlist/1">Test</Link>
        </h3>
        <small className="text-slate-600">
          2022-04-08 | Registros totales: 10
        </small>
      </div>
    </div>
  );
}

export function WaitlistCardList() {
  return (
    <div className="grid grid-cols-10 gap-1 gap-y-4">
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
      <WaitlistCard />
    </div>
  );
}
