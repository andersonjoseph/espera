import { useState } from 'react';
import { useRoute } from 'wouter';
import DataTable from 'react-data-table-component';
import { suspend, clear } from 'suspend-react';
import { EditUserModal } from './EditUserModal';
import { NewUserModal } from './NewUserModal';
import { useUsersApi } from '../api/useUsersApi';

import {
  useEditUserModalStore,
  useCreateUserModalStore,
  selectors,
} from '../stateStore';
import { useAlert } from 'react-alert';

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
  noRowsPerPage: true,
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
};

export function UsersTable() {
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearTable, setClearTable] = useState(false);

  const [_, params] = useRoute('/waitlist/:id');

  const alert = useAlert();

  const { getUsersByWaitlist, deleteUser } = useUsersApi();

  const openEditUserModal = useEditUserModalStore(selectors.editUserOpenModal);
  const closeEditUserModal = useEditUserModalStore(
    selectors.editUserCloseModal,
  );

  const openCreateUserModal = useCreateUserModalStore(
    selectors.createUserOpenModal,
  );
  const closeCreateUserModal = useCreateUserModalStore(
    selectors.createUserCloseModal,
  );

  const data = suspend(async () => {
    const res = await getUsersByWaitlist(params.id);

    return res;
  }, ['users', params.id]);

  function onClearTable() {
    setClearTable((clearTable) => !clearTable);
    setSelectedUsers([]);
    setShowBottomBar(false);
    closeEditUserModal();
  }

  function handleChange(ev) {
    setShowBottomBar(ev.selectedCount >= 1);
    setShowEditButton(ev.selectedCount < 2);

    setSelectedUsers(ev.selectedRows);
  }

  async function onDeleteUser(ev) {
    ev.preventDefault();

    if (
      !window.confirm(
        '¿Quieres eliminar los usuarios seleccionados? Esta opción no es reversible',
      )
    )
      return;

    setLoading(true);
    await Promise.all(selectedUsers.map((user) => deleteUser(user._id)));
    clear(['users', params.id]);
    alert.success('Usuarios eliminados correctamente');
    setSelectedUsers([]);
    setShowBottomBar(false);
    setClearTable((clearTable) => !clearTable);
    setLoading(false);
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data.records}
        selectableRows
        pagination
        paginationTotalRows={data.totalCount}
        paginationComponentOptions={paginationComponentOptions}
        onSelectedRowsChange={handleChange}
        clearSelectedRows={clearTable}
      />

      <button
        onClick={openCreateUserModal}
        className="-translate-y-11 text-xs bg-white-700 border border-indigo-500 text-indigo-500 font-medium px-4 py-2 rounded-lg"
      >
        Agregar Usuario
      </button>

      <span className="mb-20 block w-full bg-black" />

      {selectedUsers.length > 0 && (
        <EditUserModal clearTable={onClearTable} user={selectedUsers[0]} />
      )}
      <NewUserModal clearTable={onClearTable} />

      {showBottomBar && (
        <div className="bg-white p-4 rounded-lg border fixed bottom-0 left-0 w-full">
          <div className="justify-end flex gap-4">
            <button
              onClick={onDeleteUser}
              className="bg-white-700 text-red-500 border border-red-500 font-medium px-4 py-2 rounded-lg disabled:opacity-75"
              disabled={loading}
            >
              Eliminar Usuarios
            </button>
            {showEditButton && (
              <button
                onClick={openEditUserModal}
                className="bg-white-700 border border-indigo-500 text-indigo-500 font-medium px-4 py-2 rounded-lg disabled:opacity-75"
                disabled={loading}
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
