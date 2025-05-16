import {create} from 'zustand';
import AxiosClient from '../api/axiosClient';

const useMenuItemStore = create((set, get) => ({
    menuItems: [],
    popularMenuItems: [],
    loading: false,
    error: null,

    fetchMenuItems: async (page, status, search, pageSize) => {
        set({loading: true});
        try {
            const response = await AxiosClient.get('/api/menu-items', {
                params: { page, status, search, pageSize }
            });
            set({menuItems: response.data, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
        }
    },

    addMenuItem: async (values) => {
        set({loading: true});
        try {
             await AxiosClient.post('/api/menu-items', values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { fetchMenuItems } = get(); // Get the function from Zustand store
            fetchMenuItems(1, '', '', 10); // Example arguments: page 1, no filters, page size 10
        } catch (error) {
            set({error: error.message, loading: false});
        }
        finally {
            set({loading: false});
        }
    },

    editMenuItem: async(id, values) => {
        set({loading: true});
        try {
             await AxiosClient.put(`/api/menu-items/${id}`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { fetchMenuItems } = get(); // Get the function from Zustand store
            fetchMenuItems(1, '', '', 10); // Example arguments: page 1, no filters, page size 10
        } catch (error) {
            set({error: error.message, loading: false});
        } finally {
            set({loading: false});
        }
    }, 

    deleteMenuItem: async (id) => {
        set({loading: true});
        try {
            await AxiosClient.delete(`/api/menu-items/${id}`);
            const { fetchMenuItems } = get(); 
            fetchMenuItems(1, '', '', 10); 
        } catch (error) {
            set({error: error.message, loading: false});
        }
        finally {
            set({loading: false});
        }
    },

    fetchPopularMenuItems: async () => {
        set({loading: true});
        try {
            const response = await AxiosClient.get('/api/menu-items/most-popular');
            set({popularMenuItems: response.data, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
        }
    },
   
}))

export default useMenuItemStore;
