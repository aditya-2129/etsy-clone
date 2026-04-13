"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { CartItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = 0; // Replace with actual subtotal calculation

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
