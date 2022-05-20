import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuth0();

  const [showMenu, setShowMenu] = useState(false);

  function toggleMenu() {
    setShowMenu((prev) => !prev);
  }

  return (
    <header className="border-b py-2 text-right text-slate-700 mb-4">
      <button
        onClick={toggleMenu}
        className="flex w-full items-center justify-end"
      >
        <p className="mr-3 text-slate-700">{user.name}</p>
        <img
          className="w-8"
          src={`https://ui-avatars.com/api/?name=${user.name}&background=random&rounded=true`}
        />
      </button>
      <button
        onClick={() => logout({ returnTo: window.location.origin })}
        className="bg-white-700 text-red-500 border border-red-500 font-medium px-4 py-2 rounded-lg mt-4"
        style={{ display: showMenu ? 'inline-block' : 'none' }}
      >
        Cerrar sesión
      </button>
    </header>
  );
}
