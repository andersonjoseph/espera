import create from 'zustand';

export const selectors = {
  modalIsOpen: (state) => state.modalIsOpen,
  closeModal: (state) => state.closeModal,
  openModal: (state) => state.openModal,
};

export const useModalStore = create((set) => ({
  modalIsOpen: false,
  closeModal: () => set({ modalIsOpen: false }),
  openModal: () => set({ modalIsOpen: true }),
}));

export const useAdminModalStore = create((set) => ({
  modalIsOpen: false,
  closeModal: () => set({ modalIsOpen: false }),
  openModal: () => set({ modalIsOpen: true }),
}));
