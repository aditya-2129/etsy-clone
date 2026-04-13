import { databases, ID, Query } from "@/lib/appwrite";
import {
  DATABASE_ID,
  COLLECTION_ORDERS,
  COLLECTION_ORDER_ITEMS,
} from "@/lib/constants";
import type {
  Order,
  OrderItem,
  CreateOrderInput,
  CreateOrderItemInput,
} from "@/lib/types";
import { OrderStatus } from "@/lib/types";
import { Permission, Role } from "appwrite";

// =============================================================================
// Order Service — Orders + Order Items management
// =============================================================================

/**
 * Creates a new order along with all its order items.
 * This is a composite operation — creates the order first, then all items.
 */
export async function createOrder(
  orderData: CreateOrderInput,
  items: Omit<CreateOrderItemInput, "orderId">[]
): Promise<{ order: Order; orderItems: OrderItem[] }> {
  try {
    // Create the order document
    const order = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ORDERS,
      ID.unique(),
      orderData,
      [
        Permission.read(Role.user(orderData.buyerId)),
        Permission.update(Role.user(orderData.buyerId)),
      ]
    );

    // Create all order items with the orderId
    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const orderItem = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ORDER_ITEMS,
        ID.unique(),
        {
          ...item,
          orderId: order.$id,
        },
        [
          Permission.read(Role.user(orderData.buyerId)),
          Permission.read(Role.user(item.sellerId)),
          Permission.update(Role.user(item.sellerId)),
        ]
      );
      orderItems.push(orderItem as unknown as OrderItem);
    }

    return {
      order: order as unknown as Order,
      orderItems,
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

/**
 * Fetches all orders for a buyer, sorted by newest first.
 */
export async function getOrdersByBuyer(buyerId: string): Promise<Order[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ORDERS,
      [
        Query.equal("buyerId", buyerId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as Order[];
  } catch (error) {
    console.error("Failed to get orders by buyer:", error);
    throw error;
  }
}

/**
 * Fetches a single order by its document ID.
 */
export async function getOrderById(documentId: string): Promise<Order> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ORDERS,
      documentId
    );
    return doc as unknown as Order;
  } catch (error) {
    console.error("Failed to get order by ID:", error);
    throw error;
  }
}

/**
 * Fetches all order items for a specific order.
 */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ORDER_ITEMS,
      [Query.equal("orderId", orderId)]
    );
    return result.documents as unknown as OrderItem[];
  } catch (error) {
    console.error("Failed to get order items:", error);
    throw error;
  }
}

/**
 * Fetches all order items for a seller (incoming orders).
 */
export async function getOrderItemsBySeller(
  sellerId: string
): Promise<OrderItem[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ORDER_ITEMS,
      [
        Query.equal("sellerId", sellerId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return result.documents as unknown as OrderItem[];
  } catch (error) {
    console.error("Failed to get order items by seller:", error);
    throw error;
  }
}

/**
 * Updates the status of an order.
 */
export async function updateOrderStatus(
  documentId: string,
  status: OrderStatus
): Promise<Order> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ORDERS,
      documentId,
      { status }
    );
    return doc as unknown as Order;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
}

/**
 * Updates the status of an individual order item.
 */
export async function updateOrderItemStatus(
  documentId: string,
  status: OrderStatus
): Promise<OrderItem> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ORDER_ITEMS,
      documentId,
      { status }
    );
    return doc as unknown as OrderItem;
  } catch (error) {
    console.error("Failed to update order item status:", error);
    throw error;
  }
}

/**
 * Adds a tracking number to an order.
 */
export async function addTrackingNumber(
  documentId: string,
  trackingNumber: string
): Promise<Order> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ORDERS,
      documentId,
      { trackingNumber }
    );
    return doc as unknown as Order;
  } catch (error) {
    console.error("Failed to add tracking number:", error);
    throw error;
  }
}
