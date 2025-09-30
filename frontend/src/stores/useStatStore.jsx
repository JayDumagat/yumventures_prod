import { create } from "zustand";
import AxiosClient from "../api/axiosClient";

const useStatStore = create((set) => ({
    categoryStats: [],
    loading: false,
    reportStat: [],
    customerActivity: [],
    type: "Today",
    salesTrend: [],
    topCategories: [],
    categoryType: "quantity",
    
    changeReportType: (type) => set({ type }),
    changeCategoryType: (categoryType) => set({ categoryType }),
    fetchCategoryStats: async () => {
        set({ loading: true });
        try {
            const response = await AxiosClient.get("/statistics/menu-to-category");
            set({ categoryStats: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchReportStat: async (type) => {
        set({ loading: true });
        try {
            const response = await AxiosClient.get(`/statistics/reports-statistics?type=${type}`);
            set({ reportStat: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchSalesTrend: async (type) => {
        set({ loading: true });
        try {
            const response = await AxiosClient.get(`/statistics/sales-trend?type=${type}`);
            set({ salesTrend: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchTopCategories: async (outputType) => {
        set({ loading: true });
        try {
            const response = await AxiosClient.get(`/statistics/top-categories?outputType=${outputType}`);
            set({ topCategories: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchCustomerActivity: async () => {
        set({ loading: true });
        try {
            const response = await AxiosClient.get("/statistics/customer-activity");
            set({ customerActivity: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },


    
}));


export default useStatStore;
