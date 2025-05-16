import { create } from "zustand";
import AxiosClient from "../api/axiosClient";

const useDashboardStore = create((set) => ({
  dashboardStat: [],
   thirtyDaySaleData: [],
  loading: true,
  error: null,
  fetchDashboardStat: async () => {
    set({ loading: true });
    try {
      const response = await AxiosClient.get("/api/statistics/dashboard-statistics");
      set({ dashboardStat: response.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  resetDashboardStat: () => set({ dashboardStat: [], loading: true, error: null }),

  fetchThirtyDaysSales: async () => {
    set({ loading: true });
    try {
      const response = await AxiosClient.get("/api/statistics/sales-by-filter");
      set({ thirtyDaySaleData: response.data.totalSales, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  
}));

export default useDashboardStore;