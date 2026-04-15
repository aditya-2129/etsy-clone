import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_CART } from "@/lib/constants";
import * as productService from "@/lib/services/product.service";
import type { CartItem, AddToCartInput } from "@/lib/types";

// =============================================================================
// Cart Service — CRUD for the cart collection
// =============================================================================

/**
 * Adds a product to the cart.
 * If the product already exists in cart, increments the quantity instead.
 */
export async function addToCart(data: AddToCartInput): Promise<CartItem> {
  try {
    const product = await productService.getProductById(data.productId);
    if (product.stock <= 0) {
      throw new Error("OUT_OF_STOCK");
    }

    // Check if product is already in cart
    const existing = await getCartItemByProduct(data.buyerId, data.productId);
    const existingQuantity = existing?.quantity ?? 0;

    if (existingQuantity >= product.stock) {
      throw new Error("CART_STOCK_LIMIT");
    }

    const safeQuantity = Math.min(data.quantity, product.stock - existingQuantity);

    if (existing) {
      // Update quantity instead of creating duplicate
      return await updateCartQuantity(
        existing.$id,
        existing.quantity + safeQuantity
      );
    }

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_CART,
      ID.unique(),
      {
        ...data,
        quantity: safeQuantity,
      }
    );
    return doc as unknown as CartItem;
  } catch (error) {
    console.error("Failed to add to cart:", error);
    throw error;
  }
}

/**
 * Updates the quantity of a cart item.
 */
export async function updateCartQuantity(
  documentId: string,
  quantity: number
): Promise<CartItem> {
  try {
    if (quantity <= 0) {
      await removeFromCart(documentId);
      throw new Error("ITEM_REMOVED");
    }

    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_CART,
      documentId,
      { quantity }
    );
    return doc as unknown as CartItem;
  } catch (error) {
    if (error instanceof Error && error.message === "ITEM_REMOVED") {
      throw error;
    }
    console.error("Failed to update cart quantity:", error);
    throw error;
  }
}

/**
 * Removes a single item from the cart.
 */
export async function removeFromCart(documentId: string): Promise<void> {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_CART, documentId);
  } catch (error) {
    console.error("Failed to remove from cart:", error);
    throw error;
  }
}

/**
 * Fetches all cart items for a buyer.
 */
export async function getCart(buyerId: string): Promise<CartItem[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_CART,
      [
        Query.equal("buyerId", buyerId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as CartItem[];
  } catch (error) {
    console.error("Failed to get cart:", error);
    throw error;
  }
}

/**
 * Clears all items from a buyer's cart (typically after checkout).
 */
export async function clearCart(buyerId: string): Promise<void> {
  try {
    const items = await getCart(buyerId);

    const deletePromises = items.map((item) =>
      databases.deleteDocument(DATABASE_ID, COLLECTION_CART, item.$id)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Failed to clear cart:", error);
    throw error;
  }
}

/**
 * Gets a specific cart item by buyerId and productId.
 * Used internally to prevent duplicate cart entries.
 */
async function getCartItemByProduct(
  buyerId: string,
  productId: string
): Promise<CartItem | null> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_CART,
      [
        Query.equal("buyerId", buyerId),
        Query.equal("productId", productId),
        Query.limit(1),
      ]
    );

    if (result.documents.length === 0) return null;
    return result.documents[0] as unknown as CartItem;
  } catch (error) {
    console.error("Failed to get cart item:", error);
    return null;
  }
}

/**
 * Gets the total number of items in a buyer's cart.
 */
export async function getCartCount(buyerId: string): Promise<number> {
  try {
    const items = await getCart(buyerId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error("Failed to get cart count:", error);
    return 0;
  }
}
