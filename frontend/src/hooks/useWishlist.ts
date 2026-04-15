"use client";

import { useWishlistContext } from "@/contexts/WishlistContext";

/**
 * Hook to manage wishlist toggling with global state synchronization.
 * Now consumes standard actions from WishlistContext.
 */
export function useWishlist() {
  const { toggleWishlist: toggle, isToggling: isLoading, isWishlisted } = useWishlistContext();

  return { toggle, isLoading, isWishlisted };
}
