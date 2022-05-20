import { Link } from 'wouter';
import { selectors, useWaitlistStore } from '../stateStore';

function SidebarList(props) {
  return <ul className="mb-10">{props.children}</ul>;
}

function SidebarItem(props) {
  return (
    <li className="flex hover:bg-slate-200 rounded-lg p-3">
      <img className="w-5 mr-2" src={props.icon} />
      <Link className="text-slate-800 w-full" href={props.link}>
        {props.title}
      </Link>
    </li>
  );
}

export function Sidebar() {
  const waitlists = useWaitlistStore(selectors.waitlists);

  return (
    <aside className="p-4 col-span-2 bg-slate-100 border-r-2 min-h-screen">
      <div className="flex items-center mb-5">
        <img className="w-8" src="/images/queue.svg" />
        <h1 className="text-xl font-bold text-indigo-700">Espera</h1>
      </div>

      <SidebarList>
        <SidebarItem link="/" title="Inicio" icon="/images/home.svg" />
        <SidebarItem link="/new" title="Crear Nueva" icon="/images/add.svg" />
      </SidebarList>

      <h2 className="text-md font-medium text-slate-700 mb-5">Waitlists</h2>

      <SidebarList>
        {waitlists.map((waitlist, i) => (
          <SidebarItem
            key={`sidebar-${i}`}
            link={`/waitlist/${waitlist._id}`}
            title={waitlist.name}
            icon="/images/list.svg"
          />
        ))}
      </SidebarList>
    </aside>
  );
}
