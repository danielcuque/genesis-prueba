import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    isVegetarian: boolean;
    isAvailable: boolean;
}

interface CartItem extends Product {
    quantity: number;
    customizations?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, customizations?: string) => void;
    removeItem: (id: number) => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, customizations?: string) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id && i.customizations === customizations);
            if (existing) {
                return prev.map(i =>
                    i.id === product.id && i.customizations === customizations
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...product, quantity: 1, customizations }];
        });
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be inside CartProvider');
    return context;
};
