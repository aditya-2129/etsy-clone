import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_SHOPS } from "@/lib/constants";
import type { Shop, CreateShopInput, UpdateShopInput } from "@/lib/types";
import { Permission, Role } from "appwrite";

// =============================================================================
// Shop Service — CRUD for the shops collection
// =============================================================================

/**
 * Creates a new shop.
 * Only the seller who created it can update/delete it.
 */
export async function createShop(data: CreateShopInput): Promise<Shop> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      ID.unique(),
      data,
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(data.sellerId)),
        Permission.delete(Role.user(data.sellerId)),
      ]
    );
    return doc as unknown as Shop;
  } catch (error) {
    console.error("Failed to create shop:", error);
    throw error;
  }
}

/**
 * Fetches a shop by its URL slug.
 */
export async function getShopBySlug(slug: string): Promise<Shop> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_SHOPS,
      [Query.equal("slug", slug), Query.limit(1)]
    );

    if (result.documents.length === 0) {
      throw new Error(`Shop with slug "${slug}" not found`);
    }

    return result.documents[0] as unknown as Shop;
  } catch (error) {
    console.error("Failed to get shop by slug:", error);
    throw error;
  }
}

/**
 * Fetches all shops owned by a seller.
 */
export async function getShopsBySellerId(sellerId: string): Promise<Shop[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_SHOPS,
      [Query.equal("sellerId", sellerId), Query.orderDesc("$createdAt")]
    );
    return result.documents as unknown as Shop[];
  } catch (error) {
    console.error("Failed to get shops by seller:", error);
    throw error;
  }
}

/**
 * Fetches a shop by its document ID.
 */
export async function getShopById(documentId: string): Promise<Shop> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      documentId
    );
    return doc as unknown as Shop;
  } catch (error) {
    console.error("Failed to get shop by ID:", error);
    throw error;
  }
}

/**
 * Updates a shop's details.
 */
export async function updateShop(
  documentId: string,
  data: UpdateShopInput
): Promise<Shop> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      documentId,
      data
    );
    return doc as unknown as Shop;
  } catch (error) {
    console.error("Failed to update shop:", error);
    throw error;
  }
}

/**
 * Toggles a shop's active status.
 */
export async function toggleShopActive(
  documentId: string,
  isActive: boolean
): Promise<Shop> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      documentId,
      { isActive }
    );
    return doc as unknown as Shop;
  } catch (error) {
    console.error("Failed to toggle shop active status:", error);
    throw error;
  }
}

/**
 * Lists all active shops (for marketplace browsing).
 */
export async function listActiveShops(limit: number = 25): Promise<Shop[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_SHOPS,
      [
        Query.equal("isActive", true),
        Query.orderDesc("rating"),
        Query.limit(limit),
      ]
    );
    return result.documents as unknown as Shop[];
  } catch (error) {
    console.error("Failed to list active shops:", error);
    throw error;
  }
}
