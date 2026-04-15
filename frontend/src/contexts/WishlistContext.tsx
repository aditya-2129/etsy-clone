"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { 
  getWishlist as getWishlistService, 
  toggleWishlist as toggleWishlistService 
} from "@/lib/services/wishlist.service";
import { toast } from "sonner";
import type { WishlistItem } from "@/lib/types";

interface WishlistContextType {
  wishlistIds: Set<string>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  isLoading: boolean;
  isToggling: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist on mount or auth change
  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setWishlistIds(new Set());
        return;
      }

      setIsLoading(true);
      try {
        const items = await getWishlistService(user.$id);
        const ids = new Set(items.map((item) => item.productId));
        setWishlistIds(ids);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadWishlist();
  }, [user]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to save items to your wishlist.");
      return;
    }

    // Prevents multiple rapid clicks on the same item
    if (loadingIds.has(productId)) return;

    setLoadingIds((prev) => new Set(prev).add(productId));

    try {
      const result = await toggleWishlistService(user.$id, productId);
      
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (result.action === "added") {
          next.add(productId);
          toast.success("Added to wishlist!");
        } else {
          next.delete(productId);
          toast.info("Removed from wishlist.");
        }
        return next;
      });
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist.");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [user, loadingIds]);

  const isWishlisted = useCallback((productId: string) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  const isToggling = useCallback((productId: string) => {
    return loadingIds.has(productId);
  }, [loadingIds]);

  return (
    <WishlistContext.Provider value={{ 
      wishlistIds, 
      toggleWishlist, 
      isWishlisted, 
      isLoading,
      isToggling
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return context;
}
