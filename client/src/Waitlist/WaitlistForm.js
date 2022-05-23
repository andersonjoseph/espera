import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { suspend, clear } from 'suspend-react';
import { useLocation, useRoute } from 'wouter';
import { useWaitlistApi } from '../api/useWaitlistApi';
import { useAlert } from 'react-alert';
import { selectors, useWaitlistStore } from '../stateStore';
import { useUsersApi } from '../api/useUsersApi';
import fileDownload from 'js-file-download';

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

export function WaitlistForm() {
  const [_, params] = useRoute('/waitlist/:id');
  const [location, setLocation] = useLocation();

  const updateWaitlistStore = useWaitlistStore(selectors.updateWaitlist);
  const deleteWaitlistStore = useWaitlistStore(selectors.deleteWaitlist);

  const alert = useAlert();

  const { register, handleSubmit, reset } = useForm();
  const { getWaitlist, updateWaitlist, deleteWaitlist } = useWaitlistApi();
  const { exportUsers } = useUsersApi();

  const [loading, setLoading] = useState(false);

  const waitlistData = suspend(async () => {
    const data = await getWaitlist(params.id);
    return data;
  }, ['waitlist', params.id]);

  useEffect(() => {
    reset(waitlistData);
  }, [waitlistData]);

  async function onSubmit(newData) {
    setLoading(true);
    newData.options.userSkips = Number(newData.options.userSkips);

    let newWaitlist;
    try {
      newWaitlist = await updateWaitlist(params.id, newData);
    } catch (err) {
      let message = err.response.data.message;
      if (err.response.data.message instanceof Array) {
        message = message.map((msg) => msg.message).join('-');
      }
      alert.error('Ha ocurrido un error: ' + message);
      setLoading(false);
      return;
    }
    updateWaitlistStore(newWaitlist);
    clear(['waitlist', params.id]);

    setLoading(false);
    alert.success('Waitlist editada con éxito');
  }

  async function onExport(ev) {
    ev.preventDefault();
    const data = await exportUsers(params.id);
    fileDownload(data, `export-waitlist-${new Date()}.json`);
  }

  async function onDeleteWaitlist(ev) {
    ev.preventDefault();

    if (
      !window.confirm(
        '¿Quieres eliminar esta Waitlist? Esta opción no es reversible',
      )
    )
      setLoading(true);

    const deletedWaitlist = await deleteWaitlist(params.id);
    deleteWaitlistStore(deletedWaitlist);
    clear(['waitlist', params.id]);

    alert.success('Waitlist eliminada');
    setLoading(false);
    setLocation('/');
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
            defaultValue={waitlistData.name}
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
            defaultValue={waitlistData.options.userSkips}
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="number"
            placeholder="3"
            required
            min={0}
            {...register('options.userSkips')}
          />
        </FieldInput>
      </FormField>

      <FormField>
        <FieldContent title="Exportar Waitlist">
          Exporta esta waitlist en formato JSON
        </FieldContent>
        <FieldInput>
          <button
            onClick={onExport}
            className="text-xs bg-white-700 border border-indigo-500 text-indigo-500 font-medium px-4 py-2 rounded-lg"
          >
            Exportar
          </button>
        </FieldInput>
      </FormField>

      <div className="justify-end flex gap-4 disabled">
        <button
          onClick={onDeleteWaitlist}
          className="bg-white-700 text-red-500 border border-red-500 font-medium px-8 py-4 rounded-lg disabled:opacity-75"
          disabled={loading}
        >
          Eliminar Waitlist
        </button>
        <button
          className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg disabled:opacity-75"
          disabled={loading}
        >
          Editar Waitlist
        </button>
      </div>
    </form>
  );
}
