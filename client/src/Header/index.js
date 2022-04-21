import { useAdminModalStore, selectors } from '../stateStore';
import { AdminModal } from './AdminModal';

export function Header() {
  const openModal = useAdminModalStore(selectors.openModal);

  return (
    <header className="border-b py-2 text-right text-slate-700 mb-4">
      <AdminModal />
      <button
        onClick={openModal}
        className="flex w-full items-center justify-end"
      >
        <p className="mr-3 text-slate-700">andersonjoseph@mailfence.com</p>
        <img
          className="w-8"
          src="https://ui-avatars.com/api/?name=ander&background=random&rounded=true"
        />
      </button>
    </header>
  );
}
