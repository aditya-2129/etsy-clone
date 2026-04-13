import { databases, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

// =============================================================================
// Category Service — Read operations for the categories collection
// =============================================================================

/**
 * Lists all categories, sorted by name.
 */
export async function listCategories(): Promise<Category[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_CATEGORIES,
      [Query.orderAsc("name"), Query.limit(100)]
    );
    return result.documents as unknown as Category[];
  } catch (error) {
    console.error("Failed to list categories:", error);
    throw error;
  }
}

/**
 * Fetches a single category by its slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_CATEGORIES,
      [Query.equal("slug", slug), Query.limit(1)]
    );

    if (result.documents.length === 0) {
      throw new Error(`Category with slug "${slug}" not found`);
    }

    return result.documents[0] as unknown as Category;
  } catch (error) {
    console.error("Failed to get category by slug:", error);
    throw error;
  }
}

/**
 * Fetches a category by its document ID.
 */
export async function getCategoryById(documentId: string): Promise<Category> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_CATEGORIES,
      documentId
    );
    return doc as unknown as Category;
  } catch (error) {
    console.error("Failed to get category by ID:", error);
    throw error;
  }
}
