import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_REVIEWS } from "@/lib/constants";
import type {
  Review,
  CreateReviewInput,
  UpdateReviewInput,
} from "@/lib/types";
import { Permission, Role } from "appwrite";

// =============================================================================
// Review Service — CRUD for the reviews collection
// =============================================================================

/**
 * Creates a new review for a product.
 * Only the reviewer can update/delete their own review.
 */
export async function createReview(data: CreateReviewInput): Promise<Review> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_REVIEWS,
      ID.unique(),
      data
    );
    return doc as unknown as Review;
  } catch (error) {
    console.error("Failed to create review:", error);
    throw error;
  }
}

/**
 * Fetches all reviews for a specific product, newest first.
 */
export async function getReviewsByProduct(
  productId: string
): Promise<Review[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_REVIEWS,
      [
        Query.equal("productId", productId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as Review[];
  } catch (error) {
    console.error("Failed to get reviews by product:", error);
    throw error;
  }
}

/**
 * Fetches all reviews written by a specific buyer.
 */
export async function getReviewsByBuyer(buyerId: string): Promise<Review[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_REVIEWS,
      [
        Query.equal("buyerId", buyerId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as Review[];
  } catch (error) {
    console.error("Failed to get reviews by buyer:", error);
    throw error;
  }
}

/**
 * Updates a review's rating and/or comment.
 */
export async function updateReview(
  documentId: string,
  data: UpdateReviewInput
): Promise<Review> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_REVIEWS,
      documentId,
      data
    );
    return doc as unknown as Review;
  } catch (error) {
    console.error("Failed to update review:", error);
    throw error;
  }
}

/**
 * Deletes a review.
 */
export async function deleteReview(documentId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_REVIEWS,
      documentId
    );
  } catch (error) {
    console.error("Failed to delete review:", error);
    throw error;
  }
}

/**
 * Calculates the average rating for a product from all its reviews.
 */
export async function calculateProductRating(
  productId: string
): Promise<{ average: number; count: number }> {
  try {
    const reviews = await getReviewsByProduct(productId);

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = Math.round((sum / reviews.length) * 10) / 10;

    return { average, count: reviews.length };
  } catch (error) {
    console.error("Failed to calculate product rating:", error);
    throw error;
  }
}

/**
 * Composite function: creates a review and then automatically updates
 * the product's average rating and review count.
 */
export async function addReviewAndUpdateProduct(
  data: CreateReviewInput
): Promise<Review> {
  try {
    // 1. Create the review
    const review = await createReview(data);

    // 2. Calculate the new rating
    const { average, count } = await calculateProductRating(data.productId);

    // 3. Update the product document
    // We import updateProduct locally if needed or just use the DB client directly
    await databases.updateDocument(
      DATABASE_ID,
      "products", // COLLECTION_PRODUCTS
      data.productId,
      {
        rating: average,
        reviewCount: count,
      }
    );

    return review;
  } catch (error) {
    console.error("Failed in addReviewAndUpdateProduct:", error);
    throw error;
  }
}
