import { useState } from 'react';
import Modal from 'react-modal';
import { clear } from 'suspend-react';
import { useCreateUserModalStore, selectors } from '../stateStore';
import { useUsersApi } from '../api/useUsersApi';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useRoute } from 'wouter';

export function NewUserModal({ clearTable }) {
  const [_, params] = useRoute('/waitlist/:id');
  const isOpen = useCreateUserModalStore(selectors.createUserModalIsOpen);
  const closeModal = useCreateUserModalStore(selectors.createUserCloseModal);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const { createUser } = useUsersApi();
  const alert = useAlert();

  async function onSubmit(data) {
    setLoading(true);
    data.position = Number(data.position);
    data.referrers = Number(data.referrers);
    data.waitlist = params.id;
    if (data.name === '') delete data.name;

    try {
      await createUser(data);
    } catch (err) {
      let message = err.response.data.message;
      if (err.response.data.message instanceof Array) {
        message = message.map((msg) => msg.message).join('-');
      }
      alert.error('Ha ocurrido un error: ' + message);
      setLoading(false);
      return;
    }
    clear(['users', params.id]);
    clearTable();

    alert.success('Usuario creado con éxito');
    reset();
    setLoading(false);
    closeModal();
  }

  return (
    <Modal
      isOpen={isOpen}
      className="w-6/12 bg-white m-auto mt-10 border rounded-lg drop-shadow-md p-8"
      ariaHideApp={false}
      onRequestClose={closeModal}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-slate-900 text-xl font-medium">Crear Usuario</h2>
        <button
          onClick={closeModal}
          className="font-medium text-slate-600 cursor-pointer"
        >
          X
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="font-medium text-slate-900 block">Nombre</label>
          <input
            className="border border-gray-300 p-2 rounded-lg w-full block"
            type="text"
            placeholder="John Doe"
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

        <div className="text-right mt-10">
          <button
            disabled={loading}
            className="bg-indigo-700 hover:bg-indigo-900 text-white font-medium px-8 py-4 rounded-lg disabled:opacity-75"
          >
            Crear Usuario
          </button>
        </div>
      </form>
    </Modal>
  );
}
