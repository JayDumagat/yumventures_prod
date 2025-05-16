import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

const useAuthStore = create(
  persist(
    (set) => ({
      user: undefined,

      login: async (values) => {
        try {
          const response = await axiosClient.post("/api/auth/login", values);
          set({ user: response.data.user });
          return true;
        } catch {
          console.error("Login failed");
          return false;
        }
      },

      register: async (values) => {
        try {
          const response = await axiosClient.post("/api/auth/register", values);
          set({ user: response.data.user });
          return true;
        } catch (error) {
          console.error("Registration failed:", error);
          return false;
        }
      },

      checkAuth: async () => {
        try {
          const response = await axiosClient.get("/api/auth/session");
          set({ user: response.data.user });
        } catch {
          toast.error("Session expired. Please log in again.");
          set({ user: null });
        }
      },

      logout: async () => {
        try {
          await axiosClient.post("/api/auth/logout", {}, { withCredentials: true });
          set({ user: null });
        } catch (err) {
          console.error('Logout failed:', err);
        }
      },

      sendEmail: async (email) => {
        try {
          await axiosClient.post("/api/auth/request-code", { email });
          return true;
        } catch (error) {
          console.error("Error sending email:", error);
          return false;
        }
      },

      validateCode: async (code) => {
        try {
          await axiosClient.post("/api/auth/validate-code", { code });
          return true;
        } catch (error) {
          console.error("Error validating code:", error);
          return false;
        }
      },

      resendCode: async (email) => {
        try {
          await axiosClient.post("/api/auth/request-code", { email });
          return true;
        } catch (error) {
          console.error("Error resending code:", error);
          return false;
        }
      },

      resetPassword: async (email, password) => {
        try {
          await axiosClient.post("/api/auth/reset-password", { email, password });
          return true;
        } catch (error) {
          console.error("Error resetting password:", error);
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist the user object
      onRehydrateStorage: () => (state) => {
        // This function is called when the store is rehydrated
        // You can add any side effects here if needed

        state?.checkAuth(); // Check authentication status after rehydration
      },
    }
  )
);

export default useAuthStore;
