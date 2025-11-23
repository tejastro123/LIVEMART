// client/src/context/CartContext.js
import React, { createContext, useReducer, useEffect } from 'react';

// Reducer function to manage cart state
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.cart.findIndex(item => item._id === action.payload._id);
            if (existingItemIndex > -1) {
                // If item exists, update its quantity
                const updatedCart = [...state.cart];
                updatedCart[existingItemIndex].quantity += action.payload.quantity;
                return { ...state, cart: updatedCart };
            } else {
                // If item is new, add it to the cart
                return { ...state, cart: [...state.cart, action.payload] };
            }

        case 'UPDATE_QUANTITY':
            const cartWithUpdatedQty = state.cart.map(item =>
                item._id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return { ...state, cart: cartWithUpdatedQty };

        case 'REMOVE_FROM_CART':
            return { ...state, cart: state.cart.filter(item => item._id !== action.payload.id) };

        case 'SAVE_FOR_LATER':
            const itemToSave = state.cart.find(item => item._id === action.payload.id);
            if (itemToSave) {
                return {
                    ...state,
                    cart: state.cart.filter(item => item._id !== action.payload.id),
                    savedItems: [...state.savedItems, itemToSave]
                };
            }
            return state;

        case 'MOVE_TO_CART':
            const itemToMove = state.savedItems.find(item => item._id === action.payload.id);
            if (itemToMove) {
                return {
                    ...state,
                    savedItems: state.savedItems.filter(item => item._id !== action.payload.id),
                    cart: [...state.cart, itemToMove]
                };
            }
            return state;

        case 'REMOVE_FROM_SAVED':
            return {
                ...state,
                savedItems: state.savedItems.filter(item => item._id !== action.payload.id)
            };

        case 'APPLY_COUPON':
            return {
                ...state,
                appliedCoupon: action.payload
            };

        case 'REMOVE_COUPON':
            return {
                ...state,
                appliedCoupon: null
            };

        case 'INITIALIZE_CART':
            return action.payload;

        case 'CLEAR_CART':
            return { ...state, cart: [], appliedCoupon: null };

        default:
            return state;
    }
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize state from localStorage or as default object
    const getInitialState = () => {
        try {
            const savedState = localStorage.getItem('cartState');
            if (savedState) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error('Error loading cart state:', error);
        }
        return {
            cart: [],
            savedItems: [],
            appliedCoupon: null
        };
    };

    const [state, dispatch] = useReducer(cartReducer, getInitialState());

    // Persist cart state to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cartState', JSON.stringify(state));
        } catch (error) {
            console.error('Error saving cart state:', error);
        }
    }, [state]);

    return (
        <CartContext.Provider value={{ cart: state.cart, savedItems: state.savedItems, appliedCoupon: state.appliedCoupon, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

