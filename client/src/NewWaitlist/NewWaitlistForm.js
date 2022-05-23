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

    let res;
    try {
      res = await createWaitlist(data);
    } catch (err) {
      let message = err.response.data.message;
      if (err.response.data.message instanceof Array) {
        message = message.map((msg) => msg.message).join('-');
      }
      alert.error('Ha ocurrido un error: ' + message);
      setLoading(false);
      return;
    }
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
            min={0}
            {...register('options.userSkips')}
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
