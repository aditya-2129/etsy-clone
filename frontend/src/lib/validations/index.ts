import { z } from "zod";

// =============================================================================
// Auth Schemas
// =============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(128, "Name must be under 128 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// =============================================================================
// Shop Schemas
// =============================================================================

export const createShopSchema = z.object({
  name: z
    .string()
    .min(3, "Shop name must be at least 3 characters")
    .max(128, "Shop name must be under 128 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(128, "Slug must be under 128 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().max(2048, "Description must be under 2048 characters").optional(),
  location: z.string().max(256, "Location must be under 256 characters").optional(),
  policies: z.string().max(4096, "Policies must be under 4096 characters").optional(),
});

export type CreateShopFormData = z.infer<typeof createShopSchema>;

export const updateShopSchema = createShopSchema.partial();
export type UpdateShopFormData = z.infer<typeof updateShopSchema>;

// =============================================================================
// Product Schemas
// =============================================================================

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(256, "Title must be under 256 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(4096, "Description must be under 4096 characters"),
  price: z
    .number({ error: "Price is required" })
    .positive("Price must be greater than 0"),
  compareAtPrice: z
    .number()
    .positive("Compare price must be positive")
    .optional()
    .nullable(),
  categoryId: z.string().min(1, "Category is required"),
  stock: z
    .number({ error: "Stock is required" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  shippingCost: z.number().min(0, "Shipping cost cannot be negative").optional().nullable(),
  processingTime: z.string().max(128).optional().nullable(),
  materials: z.array(z.string()).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

// =============================================================================
// Review Schema
// =============================================================================

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  comment: z.string().max(2048, "Review must be under 2048 characters").optional(),
});

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;

// =============================================================================
// Checkout Schema
// =============================================================================

export const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .min(10, "Please enter a full shipping address")
    .max(512, "Address must be under 512 characters"),
  paymentMethod: z.enum({ cod: "cod", upi: "upi", card: "card" }, {
    error: "Please select a payment method",
  }),
  notes: z.string().max(512, "Notes must be under 512 characters").optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// =============================================================================
// User Profile Schema
// =============================================================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(128, "Name must be under 128 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  addresses: z.string().max(1024, "Address must be under 1024 characters").optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
