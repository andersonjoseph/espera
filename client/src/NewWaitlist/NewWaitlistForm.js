import { useState } from 'react';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { useLocation } from 'wouter';
import { useWaitlistApi } from '../api/useWaitlistApi';
import { selectors, useWaitlistStore } from '../stateStore';

function FieldContent(props) {
  return (
    <div className="col-span-5">
      <label className="font-medium text-slate-900 block">{props.title}</label>
      <small className="text-slate-600">{props.children}</small>
    </div>
  );
}

function FieldInput(props) {
  return <div className="col-span-7">{props.children}</div>;
}

function FormField(props) {
  return (
    <div className="grid grid-cols-12 gap-8 items-center border-b pb-8 mb-8">
      {props.children}
    </div>
  );
}

export function NewWaitlistForm() {
  const [location, setLocation] = useLocation();
  const { register, handleSubmit } = useForm();
  const { createWaitlist } = useWaitlistApi();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const addWaitlistStore = useWaitlistStore(selectors.addWaitlist);

  async function onSubmit(data) {
    setLoading(true);

    data.options.userSkips = Number(data.options.userSkips);

    const res = await createWaitlist(data);
    addWaitlistStore(res);
    setLoading(false);

    alert.success('Waitlist creada con éxito');

    setLocation(`/waitlist/${res._id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FieldContent title="Nombre de tu Waitlist">
          Este nombre se muestra a los usuarios cuando se registran y en los
          email
        </FieldContent>
        <FieldInput>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="text"
            placeholder="Mi waitlist"
            required
            {...register('name')}
          />
        </FieldInput>
      </FormField>

      <FormField>
        <FieldContent title="Puestos que avanzan al referir">
          Cuando un usuario refiere a otro, puedes dejar que el primer usuario
          avance puestos en la cola. Este campo especifica cuantos puestos hacia
          adelante puede avanzar.
        </FieldContent>
        <FieldInput>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="number"
            placeholder="3"
            required
            {...register('options.userSkips')}
          />
        </FieldInput>
      </FormField>

      <FormField>
        <FieldContent title="Enviar correo a los usuarios">
          Los usuarios que se registren en la waitlist recibiran un correo que
          contiene la informacion sobre su enlace de referido y posición en la
          cola
        </FieldContent>
        <FieldInput>
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-400 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            {...register('options.sendEmails')}
          />
        </FieldInput>
      </FormField>
      <FormField>
        <FieldContent title="Verificar nuevos usuarios">
          Los nuevos usuarios en tu waitlist recibiran un email de verificación.
        </FieldContent>
        <FieldInput>
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-400 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            {...register('options.verifyEmails')}
          />
        </FieldInput>
      </FormField>

      <div className="text-right">
        <button
          className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg disabled:opacity-75"
          disabled={loading}
        >
          Crear Waitlist
        </button>
      </div>
    </form>
  );
}
