import { create } from "zustand";

const useFilterStore = create((set) => ({
    page: 1,
    status: 'all',
    search: '',
    pageSize: 10,
    currentPage: 1,

    setCurrentPage: (currentPage) => set({ currentPage }),
    setPage: (page) => set({ page }),
    setStatus: (status) => set({ status }),
    setSearch: (search) => set({ search }),
    setPageSize: (pageSize) => set({ pageSize }),
    resetFilters: () => set({ page: 1, status: 'all', search: '', pageSize: 10 }),
}))

export default useFilterStore;