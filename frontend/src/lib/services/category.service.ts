import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { Permission, Role } from "appwrite";

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

// =============================================================================
// Admin — Category Management
// =============================================================================

interface CreateCategoryInput {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  icon?: string;
  description?: string;
}

/**
 * Creates a new category. Admin-only operation.
 */
export async function createCategory(
  data: CreateCategoryInput
): Promise<Category> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_CATEGORIES,
      ID.unique(),
      data,
      [Permission.read(Role.any())]
    );
    return doc as unknown as Category;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
}

/**
 * Updates an existing category. Admin-only operation.
 */
export async function updateCategory(
  documentId: string,
  data: UpdateCategoryInput
): Promise<Category> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_CATEGORIES,
      documentId,
      data
    );
    return doc as unknown as Category;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw error;
  }
}

/**
 * Deletes a category. Admin-only operation.
 * Warning: Products referencing this category will have orphaned categoryId fields.
 */
export async function deleteCategory(documentId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_CATEGORIES,
      documentId
    );
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
}

