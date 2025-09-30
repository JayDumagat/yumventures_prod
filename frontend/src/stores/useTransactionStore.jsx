import { create } from "zustand";
import axiosClient from '../api/axiosClient'

const useTransactionStore = create((set) => ({
  transactions: [],
    loading: false,
    error: null,
    fetchTransactions: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axiosClient.get("/transactions/");
        set({ transactions: response.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    fetchPaymentLink: async (values) => {
      set({ loading: true, error: null });
      try {
        const response = await axiosClient.post("/transactions/request-payment-link", values);
        set({ paymentLink: response.data, loading: false });
        return response.data;
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }

}))

export default useTransactionStore
