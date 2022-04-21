import { useForm } from 'react-hook-form';

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
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  function deleteWaitlist(ev) {
    ev.preventDefault();

    if (
      !window.confirm(
        '¿Quieres eliminar esta Waitlist? Esta opción no es reversible',
      )
    )
      return;

    //TODO: Delete waitlist
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
            {...register('skipSpots')}
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
            {...register('sendEmail')}
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
            {...register('verifyEmail')}
          />
        </FieldInput>
      </FormField>

      <div className="justify-end flex gap-4">
        <button
          onClick={deleteWaitlist}
          className="bg-white-700 text-red-500 border border-red-500 font-medium px-8 py-4 rounded-lg"
        >
          Eliminar Waitlist
        </button>
        <button className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg">
          Editar Waitlist
        </button>
      </div>
    </form>
  );
}
