import create from 'zustand';
import { ApiClient } from './api/ApiClient';

export const selectors = {
  modalIsOpen: (state) => state.modalIsOpen,
  closeModal: (state) => state.closeModal,
  openModal: (state) => state.openModal,

  waitlists: (state) => state.waitlists,
  fetch: (state) => state.fetch,
  addWaitlist: (state) => state.addWaitlist,
  updateWaitlist: (state) => state.updateWaitlist,
  deleteWaitlist: (state) => state.deleteWaitlist,
};

export const useModalStore = create((set) => ({
  modalIsOpen: false,
  closeModal: () => set({ modalIsOpen: false }),
  openModal: () => set({ modalIsOpen: true }),
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
