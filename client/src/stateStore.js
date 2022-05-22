import create from 'zustand';
import { ApiClient } from './api/ApiClient';

export const selectors = {
  editUserModalIsOpen: (state) => state.editUserModalIsOpen,
  editUserCloseModal: (state) => state.editUserCloseModal,
  editUserOpenModal: (state) => state.editUserOpenModal,

  createUserModalIsOpen: (state) => state.createUserModalIsOpen,
  createUserCloseModal: (state) => state.createUserCloseModal,
  createUserOpenModal: (state) => state.createUserOpenModal,

  waitlists: (state) => state.waitlists,
  fetch: (state) => state.fetch,
  addWaitlist: (state) => state.addWaitlist,
  updateWaitlist: (state) => state.updateWaitlist,
  deleteWaitlist: (state) => state.deleteWaitlist,
};

export const useEditUserModalStore = create((set) => ({
  editUserModalIsOpen: false,
  editUserCloseModal: () => set({ editUserModalIsOpen: false }),
  editUserOpenModal: () => set({ editUserModalIsOpen: true }),
}));

export const useCreateUserModalStore = create((set) => ({
  createUserModalIsOpen: false,
  createUserCloseModal: () => set({ createUserModalIsOpen: false }),
  createUserOpenModal: () => set({ createUserModalIsOpen: true }),
}));

export const useWaitlistStore = create((set, get) => ({
  waitlists: [],
  fetch: async () => {
    const waitlists = (await ApiClient.instance.get('waitlists')).data;

    set({ waitlists });
  },
  addWaitlist: (waitlist) =>
    set((state) => ({
      waitlists: state.waitlists.concat(waitlist),
    })),
  updateWaitlist: (waitlist) => {
    const waitlists = [...get().waitlists];

    const index = waitlists.findIndex(
      (element) => element._id === waitlist._id,
    );
    if (index === -1) return;

    waitlists[index] = waitlist;

    set({ waitlists });
  },

  deleteWaitlist: (waitlist) => {
    const waitlists = [...get().waitlists];

    const index = waitlists.findIndex(
      (element) => element._id === waitlist._id,
    );
    if (index === -1) return;

    waitlists.splice(index, 1);

    set({ waitlists });
  },
}));
