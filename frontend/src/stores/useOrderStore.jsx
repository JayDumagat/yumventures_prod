import {create} from 'zustand';
import axiosClient from '../api/axiosClient'

const useOrderStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosClient.get('/orders');
            set({ orders: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    changeOrderStatus: async (orderId, status) => {
        set({ loading: true, error: null });
        try {
            await axiosClient.put(`/orders/status-update/${orderId}`, { status });
            const {fetchOrders} = get();
            fetchOrders();
            set({ loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchUserOrders: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosClient.get('/orders/user-orders');
            set({ orders: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    appendOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    replaceOrder: (updatedOrder) => set((state) => ({
        orders: state.orders.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    }))

    
}));

export default useOrderStore;
