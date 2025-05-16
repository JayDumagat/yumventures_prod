import { create } from "zustand";

const useDialogStore = create((set) => ({
    isOpen: false,
    dialogType: null,
    dialogProps: {},
    toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
    openDialog: (dialogType, dialogProps = {}) => set({ isOpen: true, dialogType, dialogProps }),
    closeDialog: () => set({ isOpen: false, dialogType: null, dialogProps: {} }),
}));

export default useDialogStore;