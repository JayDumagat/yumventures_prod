import { create } from "zustand";
import AxiosClient from "../api/axiosClient";

const useUserStore = create((set, get) => ({
    users: [],
    fetchStaff: async () => {
        try {
            const response = await AxiosClient.get("/api/staffs");
            set({ users: response.data });
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    },

    addUser: async (values) => {
        try {
            const response = await AxiosClient.post("/api/staffs", values);
           const { fetchStaff } = get(); // Get the function from Zustand store
            fetchStaff(); // Refresh the staff list after adding a new user
            return response.data; // Return the newly added user
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    }));

export default useUserStore;