// client/src/store/useAuthStore.js
import { create } from 'zustand';
import api from '../api/axios';
import { toast } from 'react-toastify';

const useAuthStore = create((set, get) => ({
    user: null,
    loading: true,
    wishlist: [], // <-- 1. Add wishlist state

    loadUser: async () => {
        try {
            const res = await api.get('/api/auth');
            set({ user: res.data, loading: false });
            get().fetchWishlist();
        } catch (err) {
            localStorage.removeItem('token'); // The token was invalid
            set({ user: null, loading: false });
        }
    },

    // --- 2. Add actions to manage the wishlist ---
    fetchWishlist: async () => {
        try {
            const { data } = await api.get('/api/wishlist');
            set({ wishlist: data });
        } catch (err) {
            console.error('Failed to fetch wishlist');
        }
    },

    addToWishlist: async (productId) => {
        try {
            const { data } = await api.post(`/api/wishlist/${productId}`);
            set({ wishlist: data });
            toast.success('Added to wishlist!');
        } catch (err) {
            toast.error(err.response.data.msg || 'Could not add to wishlist.');
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const { data } = await api.delete(`/api/wishlist/${productId}`);
            set({ wishlist: data });
            toast.info('Removed from wishlist.');
        } catch (err) {
            toast.error('Could not remove from wishlist.');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, wishlist: [] });
    },

    disconnectGoogle: async () => {
        try {
            const { data } = await api.put('/api/users/disconnect-google');
            // Update the user state with the response from the server
            set({ user: data });
            toast.info('Google Calendar has been disconnected.');
        } catch (err) {
            toast.error('Failed to disconnect Google Calendar.');
        }
    },
}));

export default useAuthStore;