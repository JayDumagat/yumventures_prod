import { create } from 'zustand';

const useNavAccordionStore = create((set) => ({
  accordions: {},

  toggleAccordion: (key) =>
    set((state) => ({
      accordions: {
        ...Object.keys(state.accordions).reduce((acc, k) => {
          acc[k] = false; 
          return acc;
        }, {}),
        [key]: !state.accordions[key],
      },
    })),

  openAccordion: (key) =>
    set((state) => ({
      accordions: {
        ...Object.keys(state.accordions).reduce((acc, k) => {
          acc[k] = false;
          return acc;
        }, {}),
        [key]: true,
      },
    })),

  closeAccordion: (key) =>
    set((state) => ({
      accordions: {
        ...state.accordions,
        [key]: false,
      },
    })),

  isAccordionOpen: (key) => {
    return !!useNavAccordionStore.getState().accordions[key];
  },
}));

export default useNavAccordionStore;