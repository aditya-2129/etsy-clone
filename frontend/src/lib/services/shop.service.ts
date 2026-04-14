import { databases, ID, Query } from "@/lib/appwrite";
import {
  DATABASE_ID,
  COLLECTION_SHOPS,
  DEFAULT_PAGE_SIZE,
} from "@/lib/constants";
import type {
  Shop,
  CreateShopInput,
  UpdateShopInput,
  ShopFilters,
  PaginatedResponse,
} from "@/lib/types";
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
    const shopData = {
      ...data,
      isApproved: data.isApproved ?? false,
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      ID.unique(),
      shopData,
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
        Query.equal("isApproved", true),
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

// =============================================================================
// Admin — Shop Management
// =============================================================================

/**
 * Approves a shop so it becomes visible in the marketplace.
 */
export async function approveShop(documentId: string): Promise<Shop> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      documentId,
      { isApproved: true }
    );
    return doc as unknown as Shop;
  } catch (error) {
    console.error("Failed to approve shop:", error);
    throw error;
  }
}

/**
 * Rejects/unapproves a shop, removing it from marketplace visibility.
 */
export async function rejectShop(documentId: string): Promise<Shop> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_SHOPS,
      documentId,
      { isApproved: false }
    );
    return doc as unknown as Shop;
  } catch (error) {
    console.error("Failed to reject shop:", error);
    throw error;
  }
}

/**
 * Lists shops pending admin approval.
 */
export async function listPendingShops(): Promise<Shop[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_SHOPS,
      [
        Query.equal("isApproved", false),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as Shop[];
  } catch (error) {
    console.error("Failed to list pending shops:", error);
    throw error;
  }
}

/**
 * Lists all shops with optional filtering and pagination.
 * Intended for admin panel — returns shops regardless of active/approved status.
 */
export async function listAllShops(
  filters: ShopFilters = {}
): Promise<PaginatedResponse<Shop>> {
  try {
    const queries: string[] = [];
    const {
      isActive,
      isApproved,
      page = 0,
      limit = DEFAULT_PAGE_SIZE,
    } = filters;

    if (isActive !== undefined) {
      queries.push(Query.equal("isActive", isActive));
    }
    if (isApproved !== undefined) {
      queries.push(Query.equal("isApproved", isApproved));
    }

    queries.push(Query.orderDesc("$createdAt"));
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_SHOPS,
      queries
    );

    return {
      documents: result.documents as unknown as Shop[],
      total: result.total,
      hasMore: (page + 1) * limit < result.total,
    };
  } catch (error) {
    console.error("Failed to list all shops:", error);
    throw error;
  }
}
