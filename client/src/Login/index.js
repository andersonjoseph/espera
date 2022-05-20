import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const Login = () => {
  const { loginWithPopup } = useAuth0();

  return (
    <article className="p-4 px-8 col-span-12 flex justify-center items-center pt-8">
      <section>
        <div className="flex items-center justify-center mb-10 ">
          <img className="w-7" src="/images/queue.svg" />
          <h1 className="text-2xl font-bold text-indigo-700">Espera</h1>
        </div>

        <button
          onClick={() => loginWithPopup()}
          className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg"
        >
          Inicia sesión
        </button>
      </section>
    </article>
  );
};
