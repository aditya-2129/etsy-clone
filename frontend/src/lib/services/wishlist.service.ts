import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_WISHLIST } from "@/lib/constants";
import type { WishlistItem } from "@/lib/types";
import { Permission, Role } from "appwrite";

// =============================================================================
// Wishlist Service — Add/remove/check wishlist items
// =============================================================================

/**
 * Adds a product to the user's wishlist.
 * Returns the existing item if already wishlisted (idempotent).
 */
export async function addToWishlist(
  buyerId: string,
  productId: string
): Promise<WishlistItem> {
  try {
    // Check if already wishlisted
    const existing = await isInWishlist(buyerId, productId);
    if (existing) return existing;

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_WISHLIST,
      ID.unique(),
      { buyerId, productId },
      [
        Permission.read(Role.user(buyerId)),
        Permission.delete(Role.user(buyerId)),
      ]
    );
    return doc as unknown as WishlistItem;
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    throw error;
  }
}

/**
 * Removes an item from the wishlist by its document ID.
 */
export async function removeFromWishlist(documentId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_WISHLIST,
      documentId
    );
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
    throw error;
  }
}

/**
 * Fetches all wishlist items for a buyer.
 */
export async function getWishlist(buyerId: string): Promise<WishlistItem[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_WISHLIST,
      [
        Query.equal("buyerId", buyerId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as WishlistItem[];
  } catch (error) {
    console.error("Failed to get wishlist:", error);
    throw error;
  }
}

/**
 * Checks if a product is in the user's wishlist.
 * @returns The wishlist item if found, null otherwise
 */
export async function isInWishlist(
  buyerId: string,
  productId: string
): Promise<WishlistItem | null> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_WISHLIST,
      [
        Query.equal("buyerId", buyerId),
        Query.equal("productId", productId),
        Query.limit(1),
      ]
    );

    if (result.documents.length === 0) return null;
    return result.documents[0] as unknown as WishlistItem;
  } catch (error) {
    console.error("Failed to check wishlist:", error);
    throw error;
  }
}

/**
 * Toggles a product in/out of the wishlist.
 * @returns Object with the action taken and the item (if added)
 */
export async function toggleWishlist(
  buyerId: string,
  productId: string
): Promise<{ action: "added" | "removed"; item: WishlistItem | null }> {
  try {
    const existing = await isInWishlist(buyerId, productId);

    if (existing) {
      await removeFromWishlist(existing.$id);
      return { action: "removed", item: null };
    }

    const item = await addToWishlist(buyerId, productId);
    return { action: "added", item };
  } catch (error) {
    console.error("Failed to toggle wishlist:", error);
    throw error;
  }
}
