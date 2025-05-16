import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AxiosClient from '../api/axiosClient';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      // Get total number of items in cart
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Get total price of items in cart
      get totalPrice() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      // Check if an item is already in cart
      isInCart: (itemId) => {
        return get().items.some(item => item.id === itemId);
      },
      
      // Get quantity of a specific item in cart
      getItemQuantity: (itemId) => {
        const item = get().items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
      },
      
      // Add item to cart
      addToCart: (menuItem, quantity = 1) => {
        set(state => {
          const existingItem = state.items.find(item => item.id === menuItem.id);
          
          if (existingItem) {
            // Item already exists, update quantity
            return {
              items: state.items.map(item => 
                item.id === menuItem.id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          } else {
            // Item doesn't exist, add it
            return {
              items: [
                ...state.items,
                {
                  id: menuItem.id,
                  name: menuItem.name,
                  price: menuItem.price,
                  image: menuItem.image,
                  categoryId: menuItem.categoryId,
                  description: menuItem.description,
                  quantity: quantity
                }
              ]
            };
          }
        });
      },
      
      // Remove item from cart
      removeFromCart: (itemId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },
      
      // Update quantity of an item in cart
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          // If quantity is 0 or negative, remove item
          get().removeFromCart(itemId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item => 
            item.id === itemId 
              ? { ...item, quantity: quantity }
              : item
          )
        }));
      },
      
      // Increment item quantity
      incrementQuantity: (itemId) => {
        set(state => ({
          items: state.items.map(item => 
            item.id === itemId 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }));
      },
      
      // Decrement item quantity
      decrementQuantity: (itemId) => {
        const currentQuantity = get().getItemQuantity(itemId);
        
        if (currentQuantity <= 1) {
          // If quantity becomes 0, remove item
          get().removeFromCart(itemId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item => 
            item.id === itemId 
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        }));
      },
      
      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },
      
      // Checkout process
      checkout: async (customerInfo) => {
        set({ isLoading: true, error: null });
        
        try {
          const { items } = get();
          
          if (items.length === 0) {
            throw new Error('Cart is empty');
          }
          
          const orderData = {
            customerInfo,
            items: items.map(item => ({
              menuItemId: item.id,
              quantity: item.quantity,
              price: item.price
            })),
            total: get().totalPrice,
            orderSource: 'online'
          };
          
          const response = await AxiosClient.post('/orders', orderData);
          
          // Clear cart after successful checkout
          get().clearCart();
          
          set({ isLoading: false });
          return response.data;
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || error.message || 'Checkout failed'
          });
          throw error;
        }
      },
      
      // Add special instructions to the entire order
      setOrderNote: (note) => {
        set({ orderNote: note });
      },
      
      // Add instructions to a specific item
      setItemNote: (itemId, note) => {
        set(state => ({
          items: state.items.map(item => 
            item.id === itemId 
              ? { ...item, note }
              : item
          )
        }));
      }
    }),
    {
      name: 'yum-online-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);