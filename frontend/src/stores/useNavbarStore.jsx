import {create} from 'zustand';

const useNavbarStore = create((set) => ({
    isNavbarOpen: false,
    toggleNavbar: () => set((state) => ({isNavbarOpen: !state.isNavbarOpen})),
    closeNavbar: () => set({isNavbarOpen: false}),
    openNavbar: () => set({isNavbarOpen: true}),
}));

export default useNavbarStore;


