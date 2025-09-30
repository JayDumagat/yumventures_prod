import {create} from "zustand";
import {persist} from "zustand/middleware";
import axiosClient from "../api/axiosClient";
import {toast} from "react-toastify";

const useAuthStore = create(
  persist(
    (set) => ({
      user: undefined,

        login: async (values) => {
            try {
                const response = await axiosClient.post("/auth/login", values);

                if (response.data.user) {
                    set({ user: response.data.user }); // Store full user object
                    return { success: true, user: response.data.user };
                }

                return { success: false, error: "Invalid response from server" };
            } catch (error) {
                console.error("Login failed:", error.response?.data || error.message);
                return { success: false, error: error.response?.data?.message || "Login failed" };
            }
        },

      register: async (values) => {
        try {
          const response = await axiosClient.post("/auth/register", values);
          set({ user: response.data.user });
          return true;
        } catch (error) {
          console.error("Registration failed:", error);
          return false;
        }
      },

      checkAuth: async () => {
        try {
          const response = await axiosClient.get("/auth/session");
          set({ user: response.data.user });
        } catch {
          toast.error("Session expired. Please log in again.");
          set({ user: null });
        }
      },

      logout: async () => {
        try {
          await axiosClient.post("/auth/logout", {}, { withCredentials: true });
          set({ user: null });
        } catch (err) {
          console.error('Logout failed:', err);
        }
      },

        updateProfile: async (formData) => {
            try {
                console.log('=== AUTH STORE DEBUG ===');
                console.log('Sending FormData to server...');

                // Debug FormData (same as your menu item debugging)
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`FormData ${key}: FILE - ${value.name} (${value.type}, ${value.size} bytes)`);
                    } else {
                        console.log(`FormData ${key}: ${value}`);
                    }
                }
                console.log('=== END AUTH STORE DEBUG ===');

                // ADD the same headers as your working menu item store
                const response = await axiosClient.put("/auth/profile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                set({ user: response.data.user });
                return true;
            } catch (error) {
                console.error("Profile update failed:", error.response?.data || error);
                throw error;
            }
        },

      sendEmail: async (email) => {
        try {
          await axiosClient.post("/auth/request-code", { email });
          return true;
        } catch (error) {
          console.error("Error sending email:", error);
          return false;
        }
      },

      validateCode: async (code) => {
        try {
          await axiosClient.post("/auth/validate-code", { code });
          return true;
        } catch (error) {
          console.error("Error validating code:", error);
          return false;
        }
      },

      resendCode: async (email) => {
        try {
          await axiosClient.post("/auth/request-code", { email });
          return true;
        } catch (error) {
          console.error("Error resending code:", error);
          return false;
        }
      },

      resetPassword: async (email, password) => {
        try {
          await axiosClient.post("/auth/reset-password", { email, password });
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
