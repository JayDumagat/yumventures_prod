import { create } from "zustand";
import AxiosClient from "../api/axiosClient";
const usePOSStore = create((set) => ({
  cart: [],
  total: 0,

  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      return {
        cart: state.cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ),
        total: state.total + item.price,
      };
    } else {
      return {
        cart: [...state.cart, { ...item, quantity: 1 }],
        total: state.total + item.price,
      };
    }
  }),
  removeFromCart: (itemId) => set((state) => {
    const itemToRemove = state.cart.find((cartItem) => cartItem.id === itemId);
    if (itemToRemove) {
      return {
        cart: state.cart.filter((cartItem) => cartItem.id !== itemId),
        total: state.total - itemToRemove.price * itemToRemove.quantity,
      };
    }
    return state;
  }),

  clearCart: () => set(() => ({
    cart: [],
    total: 0,
  })),
  
  updateItemQuantity: (itemId, quantity) => set((state) => {
    const itemToUpdate = state.cart.find((cartItem) => cartItem.id === itemId);
    if (itemToUpdate) {
      const priceDifference = (quantity - itemToUpdate.quantity) * itemToUpdate.price;
      return {
        cart: state.cart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity } : cartItem
        ),
        total: state.total + priceDifference,
      };
    }
    return state;
  }),

  submitOrder: async (values) => {
    set({ isSubmitting: true });
    try {
      const response = await AxiosClient.post("/orders", values);
      set({ isSubmitting: false });
      return response.data;
    } catch (error) {
      console.error("Error submitting order:", error);
      set({ isSubmitting: false });
      throw error;
    }
  }


})) 
export default usePOSStore;
