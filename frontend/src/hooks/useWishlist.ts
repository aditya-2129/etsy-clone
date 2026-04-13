"use client";

import { useState } from "react";
import { toggleWishlist as toggleWishlistService } from "@/lib/services/wishlist.service";
import { toast } from "sonner";

/**
 * Hook to manage wishlist toggling with optimistic UI and loading state.
 */
export function useWishlist(buyerId: string | null) {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const toggle = async (productId: string) => {
    if (!buyerId) {
      toast.error("Please sign in to save items to your wishlist.");
      return;
    }

    setLoadingIds((prev) => new Set(prev).add(productId));

    try {
      const result = await toggleWishlistService(buyerId, productId);

      if (result.action === "added") {
        toast.success("Added to wishlist!");
      } else {
        toast.info("Removed from wishlist.");
      }
    } catch {
      toast.error("Unable to update wishlist. Please try again.");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const isLoading = (productId: string) => loadingIds.has(productId);

  return { toggle, isLoading };
}
