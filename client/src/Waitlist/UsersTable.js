import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { suspend } from 'suspend-react';
import { getUsers } from '../API';
import { EditUserModal } from './EditUserModal';

import { useModalStore, selectors } from '../stateStore';

const columns = [
  {
    name: 'Posición',
    selector: (row) => row.position,
    sortable: true,
  },
  {
    name: 'Email',
    selector: (row) => row.email,
  },
  {
    name: 'Nombre',
    selector: (row) => row.name,
  },
  {
    name: 'Fecha',
    selector: (row) => row.date,
  },
  {
    name: 'Referidos',
    selector: (row) => row.referrers,
    sortable: true,
  },
];

const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
};

export function UsersTable() {
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  const openModal = useModalStore(selectors.openModal);

  const data = suspend(async () => {
    const res = await getUsers();

    return res;
  }, []);

  function handleChange(ev) {
    setShowBottomBar(ev.selectedCount >= 1);
    setShowEditButton(ev.selectedCount < 2);

    console.log(ev);
  }

  function deleteUser(ev) {
    ev.preventDefault();

    if (
      !window.confirm(
        '¿Quieres eliminar los usuarios seleccionados? Esta opción no es reversible',
      )
    )
      return;

    // TODO: Delete user
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        selectableRows
        pagination
        paginationComponentOptions={paginationComponentOptions}
        onSelectedRowsChange={handleChange}
      />

      <span className="mb-20 block w-full bg-black" />

      <EditUserModal />

      {showBottomBar && (
        <div className="bg-white p-4 rounded-lg border fixed bottom-0 left-0 w-full">
          <div className="justify-end flex gap-4">
            <button
              onClick={deleteUser}
              className="bg-white-700 text-red-500 border border-red-500 font-medium px-4 py-2 rounded-lg"
            >
              Eliminar Usuarios
            </button>
            {showEditButton && (
              <button
                onClick={openModal}
                className="bg-white-700 border border-indigo-500 text-indigo-500 font-medium px-4 py-2 rounded-lg"
              >
                Editar Usuario
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
