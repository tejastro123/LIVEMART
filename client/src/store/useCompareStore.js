import { create } from 'zustand';
import { toast } from 'react-toastify';

// Load initial state from localStorage
const loadFromStorage = () => {
    try {
        const saved = localStorage.getItem('compareItems');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load compare items from storage:', error);
        return [];
    }
};

// Save to localStorage
const saveToStorage = (items) => {
    try {
        localStorage.setItem('compareItems', JSON.stringify(items));
    } catch (error) {
        console.error('Failed to save compare items to storage:', error);
    }
};

const useCompareStore = create((set, get) => ({
    items: loadFromStorage(), // Initialize from localStorage

    addToCompare: (product) => {
        const items = get().items;
        if (items.length >= 4) {
            return toast.warn('You can only compare up to 4 items.', {
                position: 'bottom-right',
                autoClose: 3000,
            });
        }
        if (items.some(item => item._id === product._id)) {
            return toast.info('This item is already in your compare list.', {
                position: 'bottom-right',
                autoClose: 3000,
            });
        }
        const newItems = [...items, product];
        set({ items: newItems });
        saveToStorage(newItems);
        toast.success(`${product.name} added to compare!`, {
            position: 'bottom-right',
            autoClose: 2000,
        });
    },

    removeFromCompare: (productId) => {
        const newItems = get().items.filter(item => item._id !== productId);
        set({ items: newItems });
        saveToStorage(newItems);
        toast.info('Item removed from compare', {
            position: 'bottom-right',
            autoClose: 2000,
        });
    },

    clearCompare: () => {
        set({ items: [] });
        saveToStorage([]);
        toast.success('Comparison cleared', {
            position: 'bottom-right',
            autoClose: 2000,
        });
    },

    toggleCompare: (product) => {
        const items = get().items;
        const exists = items.some(item => item._id === product._id);
        if (exists) {
            get().removeFromCompare(product._id);
        } else {
            get().addToCompare(product);
        }
    },
}));

export default useCompareStore;