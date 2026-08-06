'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../../constants/products';

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
}

interface AppContextType {
    // Cart State
    cart: CartItem[];
    addToCart: (product: Product, size: string) => void;
    removeFromCart: (productId: number, size: string) => void;
    updateQuantity: (productId: number, size: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
}

const defaultAppContext: AppContextType = {
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    cartTotal: 0
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('user_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse saved cart from localStorage', e);
            }
        }
    }, []);

    const addToCart = (product: Product, size: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
            let updated: CartItem[];
            if (existing) {
                updated = prev.map((item) =>
                    item.id === product.id && item.selectedSize === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updated = [...prev, { ...product, quantity: 1, selectedSize: size }];
            }
            localStorage.setItem('user_cart', JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromCart = (productId: number, size: string) => {
        setCart((prev) => {
            const updated = prev.filter((item) => !(item.id === productId && item.selectedSize === size));
            localStorage.setItem('user_cart', JSON.stringify(updated));
            return updated;
        });
    };

    const updateQuantity = (productId: number, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCart((prev) => {
            const updated = prev.map((item) =>
                item.id === productId && item.selectedSize === size
                    ? { ...item, quantity }
                    : item
            );
            localStorage.setItem('user_cart', JSON.stringify(updated));
            return updated;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.setItem('user_cart', JSON.stringify([]));
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    return context || defaultAppContext;
};