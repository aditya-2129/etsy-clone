import { databases, Query } from "@/lib/appwrite";
import {
  DATABASE_ID,
  COLLECTION_USERS,
  COLLECTION_SHOPS,
  COLLECTION_PRODUCTS,
  COLLECTION_ORDERS,
} from "@/lib/constants";
import type { DashboardStats, Order, User } from "@/lib/types";
import { UserRole } from "@/lib/types";

// =============================================================================
// Admin Service — Aggregated dashboard operations
// =============================================================================

/**
 * Fetches high-level dashboard statistics for the admin panel.
 * Aggregates counts from multiple collections in parallel.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [usersResult, sellersResult, shopsResult, productsResult, ordersResult, pendingShopsResult] =
      await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTION_USERS, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, COLLECTION_USERS, [
          Query.equal("role", UserRole.SELLER),
          Query.limit(1),
        ]),
        databases.listDocuments(DATABASE_ID, COLLECTION_SHOPS, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, COLLECTION_PRODUCTS, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, COLLECTION_ORDERS, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, COLLECTION_SHOPS, [
          Query.equal("isApproved", false),
          Query.limit(1),
        ]),
      ]);

    // Calculate total revenue from orders
    // Note: For large datasets, consider a server-side aggregation function
    let totalRevenue = 0;
    const allOrders = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ORDERS,
      [Query.limit(100)]
    );
    for (const order of allOrders.documents) {
      totalRevenue += (order as unknown as Order).totalAmount;
    }

    return {
      totalUsers: usersResult.total,
      totalSellers: sellersResult.total,
      totalShops: shopsResult.total,
      totalProducts: productsResult.total,
      totalOrders: ordersResult.total,
      totalRevenue,
      pendingShops: pendingShopsResult.total,
    };
  } catch (error) {
    console.error("Failed to get dashboard stats:", error);
    throw error;
  }
}

/**
 * Fetches the most recent orders across all users.
 * Used for the admin dashboard overview.
 */
export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ORDERS,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );
    return result.documents as unknown as Order[];
  } catch (error) {
    console.error("Failed to get recent orders:", error);
    throw error;
  }
}

/**
 * Fetches the most recently registered users.
 * Used for the admin dashboard overview.
 */
export async function getRecentUsers(limit: number = 10): Promise<User[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );
    return result.documents as unknown as User[];
  } catch (error) {
    console.error("Failed to get recent users:", error);
    throw error;
  }
}
