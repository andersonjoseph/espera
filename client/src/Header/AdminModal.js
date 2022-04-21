import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { useAdminModalStore, selectors } from '../stateStore';

export function AdminModal() {
  const isOpen = useAdminModalStore(selectors.modalIsOpen);
  const closeModal = useAdminModalStore(selectors.closeModal);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <Modal
      isOpen={isOpen}
      className="w-6/12 bg-white m-auto mt-10 border rounded-lg drop-shadow-md p-8"
      ariaHideApp={false}
      onRequestClose={closeModal}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-slate-900 text-xl font-medium">Editar Usuario</h2>
        <button
          onClick={closeModal}
          className="font-medium text-slate-600 cursor-pointer"
        >
          X
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Email</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="email"
            placeholder="admin@email.com"
            required
            {...register('email')}
          />
        </div>

        <hr className="my-5 block" />

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">
            Nueva Contraseña
          </label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="password"
            placeholder="p4ssw0rd"
            required
            {...register('newPassword', { minLength: 8, maxLength: 32 })}
          />
          {errors.newPassword && (
            <span className="text-red-500">
              Tu contraseña debe ser de 8 caracteres o más
            </span>
          )}
        </div>

        <div className="flex items-end gap-5 justify-between mt-10">
          <div>
            <label className="text-slate-600">
              <small>Introduce tu contraseña para confirmar los cambios</small>
            </label>
            <input
              className="border border-gray-300 p-2 rounded-lg w-full block"
              type="password"
              placeholder="Tu contraseña"
              required
              {...register('password')}
            />
          </div>
          <button className="bg-indigo-700 flex-none hover:bg-indigo-900 text-white font-medium px-4 py-3 rounded-lg">
            Editar Usuario
          </button>
        </div>
      </form>
    </Modal>
  );
}
