import { create } from "zustand";
import AxiosClient from "../api/axiosClient";
import useStatStore from "./useStatStore";

const useCategoryStore = create((set, get) => ({
  categories: [],
  selectedCategory: null,
  loading: false,

  selectCategory: (category) => {
    set({ selectedCategory: category });
  },

  fetchCategories: async (page, status, search, pageSize) => {
    set({ loading: true });
    try {
      const response = await AxiosClient.get("/categories", {
        params: { page, status, search, pageSize }
    });
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCategories: async (values) => {
    set({ loading: true });
    try {
      const response = await AxiosClient.post("/categories", values);
  
      const { fetchCategories } = get();
      await fetchCategories(1, "", "", 10);
      await useStatStore.getState().fetchCategoryStats();

      return response
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;  
    } finally {
      set({ loading: false });
    }
  },

  editCategory: async (id, values) => {
    set({ loading: true });
    try {
      const response = await AxiosClient.put(`/categories/${id}`, values);
  
      const { fetchCategories } = get();
      await fetchCategories(1, "", "", 10);

      return response
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;  
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      const response = await AxiosClient.delete(`/categories/${id}`);
  
      const { fetchCategories } = get();
      await fetchCategories(1, "", "", 10);

      return response
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;  
    } finally {
      set({ loading: false });
    }
  },

  appendCategory: (category) => {
    set((state) => ({
      categories: [...state.categories, category]
    }));
  },

  replaceCategory: (updatedCategory) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
      )
    }));
  },

  removeCategoryFromState: (id) => {
    const categoryId = typeof id === 'string' ? parseInt(id) : id;

    set((state) => {
      const filteredCategories = state.categories.filter((cat) => {
        const catId = typeof cat.id === 'string' ? parseInt(cat.id) : cat.id;
        return catId !== categoryId;
      });

      return {
        categories: filteredCategories
      };
    });
  }

  
}))

export default useCategoryStore;
