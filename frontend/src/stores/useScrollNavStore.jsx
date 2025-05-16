import {create} from 'zustand';

const useScrollNavStore = create((set) => ({
    isScrolled: false,
    setScrolled: (isScrolled) => set({isScrolled}),
}));

export default useScrollNavStore;