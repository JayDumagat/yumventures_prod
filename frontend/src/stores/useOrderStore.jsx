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

fetchOrdersForExport: async (filter = "7days") => {
  try {
    const now = new Date();
    let from, to;

    switch (filter) {
      case "7days":
        to = new Date();
        from = new Date();
        from.setDate(to.getDate() - 7);
        break;
      case "30days":
        to = new Date();
        from = new Date();
        from.setDate(to.getDate() - 30);
        break;
      case "thisMonth":
        to = new Date();
        from = new Date(to.getFullYear(), to.getMonth(), 1);
        break;
      case "all":
      default:
        to = new Date();
        from = new Date(1970, 0, 1);
        break;
    }

    const response = await axiosClient.get("/orders/export", {
      params: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });

    return response.data;
  } catch (error) {
    set({ error: error.message });
    throw error;
  }
},


    appendOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    replaceOrder: (updatedOrder) => set((state) => ({
        orders: state.orders.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    }))

    
}));

export default useOrderStore;
