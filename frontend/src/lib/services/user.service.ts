import { databases, ID, Query } from "@/lib/appwrite";
import {
  DATABASE_ID,
  COLLECTION_USERS,
  COLLECTION_SHOPS,
  DEFAULT_PAGE_SIZE,
} from "@/lib/constants";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  PaginatedResponse,
} from "@/lib/types";
import { UserRole } from "@/lib/types";
import { Permission, Role } from "appwrite";

// =============================================================================
// User Service — CRUD for the users collection
// =============================================================================

/**
 * Creates a new user document in the database.
 * Sets document-level permissions so only the user can update/delete their profile.
 */
export async function createUserDocument(data: CreateUserInput): Promise<User> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      ID.unique(),
      data,
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(data.userId)),
        Permission.delete(Role.user(data.userId)),
      ]
    );
    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to create user document:", error);
    throw error;
  }
}

/**
 * Fetches a user document by their Appwrite auth userId.
 * @returns The user document
 */
export async function getUserByUserId(userId: string): Promise<User> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      [Query.equal("userId", userId), Query.limit(1)]
    );

    if (result.documents.length === 0) {
      throw new Error(`User with userId ${userId} not found`);
    }

    return result.documents[0] as unknown as User;
  } catch (error) {
    // Only log unexpected errors, not "not found" which is expected during registration/OAuth
    if (error instanceof Error && !error.message.includes("not found")) {
      console.error("Failed to get user:", error);
    }
    throw error;
  }
}

/**
 * Updates a user's profile fields.
 */
export async function updateUser(
  documentId: string,
  data: UpdateUserInput
): Promise<User> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId,
      data
    );
    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

/**
 * Upgrades a user's role from buyer to seller.
 */
export async function upgradeToSeller(documentId: string): Promise<User> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId,
      { role: UserRole.SELLER }
    );
    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to upgrade user to seller:", error);
    throw error;
  }
}

/**
 * Fetches a user document by their database document ID.
 */
export async function getUserById(documentId: string): Promise<User> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId
    );
    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to get user by ID:", error);
    throw error;
  }
}

// =============================================================================
// Admin — User Management
// =============================================================================

/**
 * Lists users with optional filtering, sorting, and pagination.
 * Intended for the admin panel.
 */
export async function listUsers(
  filters: UserFilters = {}
): Promise<PaginatedResponse<User>> {
  try {
    const queries: string[] = [];
    const {
      role,
      isSuspended,
      page = 0,
      limit = DEFAULT_PAGE_SIZE,
    } = filters;

    if (role) {
      queries.push(Query.equal("role", role));
    }
    if (isSuspended !== undefined) {
      queries.push(Query.equal("isSuspended", isSuspended));
    }

    queries.push(Query.orderDesc("$createdAt"));
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      queries
    );

    return {
      documents: result.documents as unknown as User[],
      total: result.total,
      hasMore: (page + 1) * limit < result.total,
    };
  } catch (error) {
    console.error("Failed to list users:", error);
    throw error;
  }
}

/**
 * Suspends a user account. 
 * - Updates database flag.
 * - Automatically deactivates their shop to hide products.
 */
export async function suspendUser(documentId: string): Promise<User> {
  try {
    // 1. Get user to see if they have a shop
    const userDoc = await getUserById(documentId);

    // 2. Suspend the user
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId,
      { isSuspended: true }
    );

    // 3. Deactivate their shop if linked
    if (userDoc.shopId) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_SHOPS,
        userDoc.shopId,
        { isActive: false }
      );
    }

    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to suspend user:", error);
    throw error;
  }
}

/**
 * Unsuspends a previously suspended user account.
 * - Restores database flag.
 * - Reactivates their shop.
 */
export async function unsuspendUser(documentId: string): Promise<User> {
  try {
    // 1. Get user to see if they have a shop
    const userDoc = await getUserById(documentId);

    // 2. Unsuspend the user
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId,
      { isSuspended: false }
    );

    // 3. Reactivate their shop if linked
    if (userDoc.shopId) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_SHOPS,
        userDoc.shopId,
        { isActive: true }
      );
    }

    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to unsuspend user:", error);
    throw error;
  }
}

/**
 * Changes a user's role. Admin-only operation.
 */
export async function changeUserRole(
  documentId: string,
  role: UserRole
): Promise<User> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId,
      { role }
    );
    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to change user role:", error);
    throw error;
  }
}

/**
 * Links a shop to a user's profile for quick reference.
 * Called after shop creation to store the shopId on the user document.
 */
export async function linkShopToUser(
  documentId: string,
  shopId: string
): Promise<User> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      documentId,
      { shopId }
    );
    return doc as unknown as User;
  } catch (error) {
    console.error("Failed to link shop to user:", error);
    throw error;
  }
}
