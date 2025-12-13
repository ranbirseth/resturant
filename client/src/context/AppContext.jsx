import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchMenuItems();
        // Load cart from local storage? Optional.
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/items`);
            setMenuItems(res.data);
            if (res.data.length === 0) {
                 // Auto seed if empty? Or just let it be empty.
                 // let's try to seed if empty for demo purposes
                 await axios.post(`${API_URL}/items/seed`);
                 const seeded = await axios.get(`${API_URL}/items`);
                 setMenuItems(seeded.data);
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
        setLoading(false);
    };

    const login = async (name, mobile) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { name, mobile });
            setUser(res.data);
            return true;
        } catch (error) {
            console.error("Login Error:", error);
            return false;
        }
    };

    const addToCart = (item, quantity = 1, customizations = []) => {
        setCart(prev => {
            // Check if same item with same customizations exists
            const existingIndex = prev.findIndex(cartItem => 
                cartItem._id === item._id && 
                JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
            );

            if (existingIndex > -1) {
                const newCart = [...prev];
                newCart[existingIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prev, { ...item, quantity, customizations }];
            }
        });
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };
    
    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const placeOrder = async (orderData) => {
        try {
            const res = await axios.post(`${API_URL}/orders`, orderData);
            clearCart();
            return res.data;
        } catch (error) {
            console.error("Order Error:", error);
            throw error;
        }
    };

    const value = {
        user,
        setUser,
        menuItems,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        login,
        placeOrder,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
