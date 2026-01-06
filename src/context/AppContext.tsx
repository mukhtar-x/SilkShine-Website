
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../constants/products';

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

    // Future global state can go here
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Cart Logic
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product, size: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.selectedSize === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, selectedSize: size }];
        });
    };

    const removeFromCart = (productId: number, size: string) => {
        setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId: number, size: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId && item.selectedSize === size ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    if (!context) throw new Error('useApp must be used within an AppProvider');
    return context;
};
