import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (food: FoodItem) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = sessionStorage.getItem('cn_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cn_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.food.id === food.id);
      if (existing) {
        toast({ title: "Updated cart", description: `${food.name} quantity increased` });
        return prev.map(item =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast({ title: "Added to cart", description: `${food.name} added to cart` });
      return [...prev, { food, quantity: 1 }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setCart(prev => prev.filter(item => item.food.id !== foodId));
    toast({ title: "Removed from cart" });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('cn_cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
