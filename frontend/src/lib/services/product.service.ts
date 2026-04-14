import { databases, ID, Query } from "@/lib/appwrite";
import {
  DATABASE_ID,
  COLLECTION_PRODUCTS,
  DEFAULT_PAGE_SIZE,
} from "@/lib/constants";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  PaginatedResponse,
} from "@/lib/types";
import { Permission, Role } from "appwrite";

// =============================================================================
// Product Service — CRUD + search/filter for the products collection
// =============================================================================

/**
 * Creates a new product listing.
 * Only the seller can update/delete their own products.
 */
export async function createProduct(data: CreateProductInput): Promise<Product> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      ID.unique(),
      data,
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(data.sellerId)),
        Permission.delete(Role.user(data.sellerId)),
      ]
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

/**
 * Fetches a single product by its URL slug.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      [Query.equal("slug", slug), Query.limit(1)]
    );

    if (result.documents.length === 0) {
      throw new Error(`Product with slug "${slug}" not found`);
    }

    return result.documents[0] as unknown as Product;
  } catch (error) {
    console.error("Failed to get product by slug:", error);
    throw error;
  }
}

/**
 * Fetches a single product by its document ID.
 */
export async function getProductById(documentId: string): Promise<Product> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      documentId
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to get product by ID:", error);
    throw error;
  }
}

/**
 * Lists products with filtering, sorting, and pagination.
 */
export async function listProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  try {
    const queries: string[] = [];
    const {
      categoryId,
      shopId,
      sellerId,
      minPrice,
      maxPrice,
      isPublished = true,
      sort = "newest",
      page = 0,
      limit = DEFAULT_PAGE_SIZE,
    } = filters;

    // Filters
    if (isPublished !== undefined) {
      queries.push(Query.equal("isPublished", isPublished));
    }
    if (categoryId) {
      queries.push(Query.equal("categoryId", categoryId));
    }
    if (shopId) {
      queries.push(Query.equal("shopId", shopId));
    }
    if (sellerId) {
      queries.push(Query.equal("sellerId", sellerId));
    }
    if (minPrice !== undefined) {
      queries.push(Query.greaterThanEqual("price", minPrice));
    }
    if (maxPrice !== undefined) {
      queries.push(Query.lessThanEqual("price", maxPrice));
    }

    // Sorting
    switch (sort) {
      case "oldest":
        queries.push(Query.orderAsc("$createdAt"));
        break;
      case "price_asc":
        queries.push(Query.orderAsc("price"));
        break;
      case "price_desc":
        queries.push(Query.orderDesc("price"));
        break;
      case "popular":
        queries.push(Query.orderDesc("totalSold"));
        break;
      case "newest":
      default:
        queries.push(Query.orderDesc("$createdAt"));
        break;
    }

    // Pagination
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      queries
    );

    return {
      documents: result.documents as unknown as Product[],
      total: result.total,
      hasMore: (page + 1) * limit < result.total,
    };
  } catch (error) {
    console.error("Failed to list products:", error);
    throw error;
  }
}

/**
 * Fulltext search on product titles.
 */
export async function searchProducts(
  query: string,
  limit: number = DEFAULT_PAGE_SIZE
): Promise<Product[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      [
        Query.search("title", query),
        Query.equal("isPublished", true),
        Query.limit(limit),
      ]
    );
    return result.documents as unknown as Product[];
  } catch (error) {
    console.error("Failed to search products:", error);
    throw error;
  }
}

/**
 * Fetches all products for a specific shop.
 */
export async function getProductsByShop(
  shopId: string,
  publishedOnly: boolean = true
): Promise<Product[]> {
  try {
    const queries: string[] = [
      Query.equal("shopId", shopId),
      Query.orderDesc("$createdAt"),
    ];

    if (publishedOnly) {
      queries.push(Query.equal("isPublished", true));
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      queries
    );
    return result.documents as unknown as Product[];
  } catch (error) {
    console.error("Failed to get products by shop:", error);
    throw error;
  }
}

/**
 * Updates a product's details.
 */
export async function updateProduct(
  documentId: string,
  data: UpdateProductInput
): Promise<Product> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      documentId,
      data
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
}

/**
 * Deletes a product listing.
 */
export async function deleteProduct(documentId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      documentId
    );
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

/**
 * Toggles a product's published status.
 */
export async function togglePublish(
  documentId: string,
  isPublished: boolean
): Promise<Product> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      documentId,
      { isPublished }
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to toggle product publish status:", error);
    throw error;
  }
}

/**
 * Increments a product's totalSold and decrements stock after a purchase.
 */
export async function updateProductAfterPurchase(
  documentId: string,
  quantitySold: number
): Promise<Product> {
  try {
    const product = await getProductById(documentId);
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      documentId,
      {
        totalSold: product.totalSold + quantitySold,
        stock: Math.max(0, product.stock - quantitySold),
      }
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to update product after purchase:", error);
    throw error;
  }
}

// =============================================================================
// Admin — Product Management
// =============================================================================

/**
 * Toggles a product's featured status. Admin-only.
 */
export async function toggleFeatured(
  documentId: string,
  isFeatured: boolean
): Promise<Product> {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      documentId,
      { isFeatured }
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to toggle product featured status:", error);
    throw error;
  }
}

/**
 * Lists featured products for the homepage.
 */
export async function listFeaturedProducts(
  limit: number = 12
): Promise<Product[]> {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      [
        Query.equal("isFeatured", true),
        Query.equal("isPublished", true),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
    return result.documents as unknown as Product[];
  } catch (error) {
    console.error("Failed to list featured products:", error);
    throw error;
  }
}

/**
 * Lists all products with full filtering, regardless of publish status.
 * Intended for the admin panel.
 */
export async function listAllProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  try {
    const queries: string[] = [];
    const {
      categoryId,
      shopId,
      sellerId,
      minPrice,
      maxPrice,
      isPublished,
      isFeatured,
      sort = "newest",
      page = 0,
      limit = DEFAULT_PAGE_SIZE,
    } = filters;

    if (isPublished !== undefined) {
      queries.push(Query.equal("isPublished", isPublished));
    }
    if (isFeatured !== undefined) {
      queries.push(Query.equal("isFeatured", isFeatured));
    }
    if (categoryId) {
      queries.push(Query.equal("categoryId", categoryId));
    }
    if (shopId) {
      queries.push(Query.equal("shopId", shopId));
    }
    if (sellerId) {
      queries.push(Query.equal("sellerId", sellerId));
    }
    if (minPrice !== undefined) {
      queries.push(Query.greaterThanEqual("price", minPrice));
    }
    if (maxPrice !== undefined) {
      queries.push(Query.lessThanEqual("price", maxPrice));
    }

    switch (sort) {
      case "oldest":
        queries.push(Query.orderAsc("$createdAt"));
        break;
      case "price_asc":
        queries.push(Query.orderAsc("price"));
        break;
      case "price_desc":
        queries.push(Query.orderDesc("price"));
        break;
      case "popular":
        queries.push(Query.orderDesc("totalSold"));
        break;
      case "newest":
      default:
        queries.push(Query.orderDesc("$createdAt"));
        break;
    }

    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      queries
    );

    return {
      documents: result.documents as unknown as Product[],
      total: result.total,
      hasMore: (page + 1) * limit < result.total,
    };
  } catch (error) {
    console.error("Failed to list all products:", error);
    throw error;
  }
}

