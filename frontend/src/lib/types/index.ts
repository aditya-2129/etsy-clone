import type { Models } from "appwrite";

// =============================================================================
// Enums
// =============================================================================

export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller",
  ADMIN = "admin",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  COD = "cod",
  UPI = "upi",
  CARD = "card",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
}

// =============================================================================
// Document Interfaces (what comes back from Appwrite)
// =============================================================================

export interface User extends Models.Document {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  phone: string | null;
  addresses: string | null;
  isSuspended: boolean;
  shopId: string | null;
}

export interface Shop extends Models.Document {
  sellerId: string;
  name: string;
  slug: string;
  description: string | null;
  banner: string | null;
  logo: string | null;
  isActive: boolean;
  isApproved: boolean;
  totalSales: number;
  rating: number;
  policies: string | null;
  location: string | null;
}

export interface Category extends Models.Document {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

export interface Product extends Models.Document {
  shopId: string;
  sellerId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  images: string[];
  stock: number;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  totalSold: number;
  rating: number;
  shippingCost: number | null;
  processingTime: string | null;
  materials: string[];
  reviewCount: number;
}

export interface Order extends Models.Document {
  buyerId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber: string | null;
  notes: string | null;
}

export interface OrderItem extends Models.Document {
  orderId: string;
  productId: string;
  shopId: string;
  sellerId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  status: OrderStatus;
}

export interface Review extends Models.Document {
  productId: string;
  buyerId: string;
  rating: number;
  comment: string | null;
  reviewerName: string;
}

export interface WishlistItem extends Models.Document {
  buyerId: string;
  productId: string;
}

export interface CartItem extends Models.Document {
  buyerId: string;
  productId: string;
  shopId: string;
  sellerId: string;
  quantity: number;
}

// =============================================================================
// Input Types (what we send TO Appwrite)
// =============================================================================

export interface CreateUserInput {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  addresses?: string;
}

export interface UpdateUserInput {
  name?: string;
  avatar?: string;
  phone?: string;
  addresses?: string;
}

export interface CreateShopInput {
  sellerId: string;
  name: string;
  slug: string;
  description?: string;
  banner?: string;
  logo?: string;
  isActive: boolean;
  isApproved?: boolean;
  totalSales: number;
  rating: number;
  policies?: string;
  location?: string;
}

export interface UpdateShopInput {
  name?: string;
  description?: string;
  banner?: string;
  logo?: string;
  isActive?: boolean;
  isApproved?: boolean;
  policies?: string;
  location?: string;
}

export interface CreateProductInput {
  shopId: string;
  sellerId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  images: string[];
  stock?: number;
  tags?: string[];
  isPublished?: boolean;
  shippingCost?: number;
  processingTime?: string;
  materials?: string[];
}

export interface UpdateProductInput {
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  categoryId?: string;
  images?: string[];
  stock?: number;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  shippingCost?: number;
  processingTime?: string;
  materials?: string[];
}

export interface CreateOrderInput {
  buyerId: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
}

export interface CreateOrderItemInput {
  orderId: string;
  productId: string;
  shopId: string;
  sellerId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CreateReviewInput {
  productId: string;
  buyerId: string;
  rating: number;
  comment?: string;
  reviewerName: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface AddToCartInput {
  buyerId: string;
  productId: string;
  shopId: string;
  sellerId: string;
  quantity: number;
}

// =============================================================================
// Filter / Query Types
// =============================================================================

export interface ProductFilters {
  categoryId?: string;
  shopId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}

// =============================================================================
// Admin Filter Types
// =============================================================================

export interface UserFilters {
  role?: UserRole;
  isSuspended?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ShopFilters {
  isActive?: boolean;
  isApproved?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminProductFilters extends ProductFilters {
  isFeatured?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalShops: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingShops: number;
}

export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
  hasMore: boolean;
}
