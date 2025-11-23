// src/frontend/context/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Nếu có rồi thì tăng số lượng
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Nếu chưa có thì thêm mới
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!');
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
