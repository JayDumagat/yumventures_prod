import {create} from 'zustand';
import AxiosClient from '../api/axiosClient';

const useMenuItemStore = create((set, get) => ({
    menuItems: [],
    popularMenuItems: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    loading: false,
    error: null,

    fetchMenuItems: async (page, status, search, pageSize) => {
        set({loading: true, error: null});
        try {
            const response = await AxiosClient.get('/api/menu-items', {
                params: { page, status, search, pageSize }
            });

            // Handle the new response structure
            if (response.data.menuItems && response.data.pagination) {
                // New structure with pagination
                set({
                    menuItems: response.data.menuItems,
                    pagination: response.data.pagination,
                    loading: false
                });
            } else if (Array.isArray(response.data)) {
                // Fallback for old structure (if some endpoints still use it)
                set({
                    menuItems: response.data,
                    loading: false
                });
            } else {
                // Unexpected structure
                console.error('Unexpected response structure:', response.data);
                set({
                    menuItems: [],
                    loading: false,
                    error: 'Unexpected response structure'
                });
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            set({error: error.message, loading: false, menuItems: []});
        }
    },

    addMenuItem: async (values) => {
        set({loading: true, error: null});
        try {
            await AxiosClient.post('/api/menu-items', values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh menu items after successful addition
            const { fetchMenuItems } = get();
            await fetchMenuItems(1, '', '', 10);
        } catch (error) {
            console.error('Error adding menu item:', error);
            set({error: error.message, loading: false});
            throw error; // Re-throw so the UI can handle it
        } finally {
            set({loading: false});
        }
    },

    editMenuItem: async(id, values) => {
        set({loading: true, error: null});
        try {
            await AxiosClient.put(`/api/menu-items/${id}`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh menu items after successful edit
            const { fetchMenuItems } = get();
            await fetchMenuItems(1, '', '', 10);
        } catch (error) {
            console.error('Error editing menu item:', error);
            set({error: error.message, loading: false});
            throw error; // Re-throw so the UI can handle it
        } finally {
            set({loading: false});
        }
    },

    deleteMenuItem: async (id) => {
        set({loading: true, error: null});
        try {
            await AxiosClient.delete(`/api/menu-items/${id}`);

            // Refresh menu items after successful deletion
            const { fetchMenuItems } = get();
            await fetchMenuItems(1, '', '', 10);
        } catch (error) {
            console.error('Error deleting menu item:', error);
            set({error: error.message, loading: false});
            throw error; // Re-throw so the UI can handle it
        } finally {
            set({loading: false});
        }
    },

    fetchPopularMenuItems: async () => {
        set({loading: true, error: null});
        try {
            const response = await AxiosClient.get('/api/menu-items/most-popular');
            set({popularMenuItems: response.data, loading: false});
        } catch (error) {
            console.error('Error fetching popular menu items:', error);
            set({error: error.message, loading: false});
        }
    },

    // Helper function to clear errors
    clearError: () => set({error: null}),

    // Helper function to get a single menu item by ID (if needed)
    getMenuItemById: async (id) => {
        set({loading: true, error: null});
        try {
            const response = await AxiosClient.get(`/api/menu-items/${id}`);
            set({loading: false});
            return response.data;
        } catch (error) {
            console.error('Error fetching menu item:', error);
            set({error: error.message, loading: false});
            throw error;
        }
    },

    appendMenuItem: (menuItem) => {
        set((state) => ({
            menuItems: [...state.menuItems, menuItem]
        }));
    },

    replaceMenuItem: (updatedMenuItem) => {
        set((state) => ({
            menuItems: state.menuItems.map((cat) =>
                cat.id === updatedMenuItem.id ? updatedMenuItem : cat
            )
        }));
    },

    removeMenuItemFromState: (id) => {
        const menuItemId = typeof id === 'string' ? parseInt(id) : id;

        set((state) => {
            const filteredMenuItems = state.menuItems.filter((cat) => {
                const catId = typeof cat.id === 'string' ? parseInt(cat.id) : cat.id;
                return catId !== menuItemId;
            });

            return {
                menuItems: filteredMenuItems
            };
        });
    }
}))

export default useMenuItemStore;