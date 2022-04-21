import Modal from 'react-modal';
import { useModalStore, selectors } from '../stateStore';
import { useForm } from 'react-hook-form';

export function EditUserModal() {
  const isOpen = useModalStore(selectors.modalIsOpen);
  const closeModal = useModalStore(selectors.closeModal);
  const { register, handleSubmit } = useForm();

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
          <label className="font-medium text-slate-900 block">Posición</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="number"
            placeholder="1"
            required
            {...register('position')}
          />
        </div>

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Nombre</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="text"
            placeholder="John Doe"
            required
            {...register('name')}
          />
        </div>

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Email</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="email"
            placeholder="usuario@email.com"
            required
            {...register('email')}
          />
        </div>

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Fecha</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="date"
            placeholder="usuario@email.com"
            required
            {...register('date')}
          />
        </div>

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Referidos</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="number"
            placeholder="1"
            required
            {...register('referrers')}
          />
        </div>

        <div className="text-right mt-10">
          <button className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg">
            Editar Usuario
          </button>
        </div>
      </form>
    </Modal>
  );
}
