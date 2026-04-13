import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_USERS } from "@/lib/constants";
import type { User, CreateUserInput, UpdateUserInput } from "@/lib/types";
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
    console.error("Failed to get user:", error);
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
