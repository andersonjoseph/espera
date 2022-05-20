import { useState } from 'react';
import Modal from 'react-modal';
import { clear } from 'suspend-react';
import { useModalStore, selectors } from '../stateStore';
import { useUsersApi } from '../api/useUsersApi';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useRoute } from 'wouter';

export function EditUserModal({ user, refreshTable }) {
  const [_, params] = useRoute('/waitlist/:id');
  const isOpen = useModalStore(selectors.modalIsOpen);
  const closeModal = useModalStore(selectors.closeModal);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const { updateUser } = useUsersApi();
  const alert = useAlert();

  async function onSubmit(data) {
    setLoading(true);
    data.position = Number(data.position);
    data.referrers = Number(data.referrers);
    if (data.name === '') delete data.name;

    await updateUser(user._id, data);
    clear(['users', params.id]);
    refreshTable();

    alert.success('Usuario editado con éxito');
    setLoading(false);
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
            defaultValue={user.position}
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
            defaultValue={user.name}
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="text"
            placeholder="John Doe"
            {...register('name')}
          />
        </div>

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Email</label>
          <input
            defaultValue={user.email}
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="email"
            placeholder="usuario@email.com"
            required
            {...register('email')}
          />
        </div>

        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Referidos</label>
          <input
            defaultValue={user.referrers}
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="number"
            placeholder="1"
            required
            {...register('referrers')}
          />
        </div>

        <div className="text-right mt-10">
          <button
            disabled={loading}
            className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg disabled:opacity-75"
          >
            Editar Usuario
          </button>
        </div>
      </form>
    </Modal>
  );
}
