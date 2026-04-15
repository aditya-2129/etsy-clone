"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import * as cartService from "@/lib/services/cart.service";
import * as productService from "@/lib/services/product.service";
import type { CartItem, Product } from "@/lib/types";

/**
 * Extended cart item that includes full product data for UI display.
 */
export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (productId: string, shopId: string, sellerId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches cart documents and their associated product details.
   */
  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const cartDocs = await cartService.getCart(user.$id);
      
      if (cartDocs.length === 0) {
        setItems([]);
        return;
      }

      // Fetch product details for all cart items
      // Optimization: Fetch all products in parallel
      const itemsWithProducts = await Promise.all(
        cartDocs.map(async (item) => {
          try {
            const product = await productService.getProductById(item.productId);
            return { ...item, product };
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return item;
          }
        })
      );

      setItems(itemsWithProducts);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      toast.error("Could not sync your cart.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Sync cart on mount and user change
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /**
   * Add to cart handler
   */
  const addToCart = async (
    productId: string,
    shopId: string,
    sellerId: string,
    quantity: number
  ) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }

    try {
      await cartService.addToCart({
        buyerId: user.$id,
        productId,
        shopId,
        sellerId,
        quantity,
      });
      await refreshCart();
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add item to cart.");
    }
  };

  /**
   * Update quantity handler
   */
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartService.updateCartQuantity(itemId, quantity);
      await refreshCart();
    } catch (error) {
      if (error instanceof Error && error.message === "ITEM_REMOVED") {
        await refreshCart();
        toast.info("Item removed from cart.");
      } else {
        console.error("Update quantity error:", error);
        toast.error("Failed to update quantity.");
      }
    }
  };

  /**
   * Remove item handler
   */
  const removeItem = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      await refreshCart();
      toast.success("Item removed.");
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("Failed to remove item.");
    }
  };

  /**
   * Clear cart handler
   */
  const clearCart = async () => {
    if (!user) return;
    try {
      await cartService.clearCart(user.$id);
      await refreshCart();
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart.");
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
