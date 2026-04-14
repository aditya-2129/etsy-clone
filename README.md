# 🛍️ Handmade Marketplace — Etsy Clone

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Appwrite](https://img.shields.io/badge/Appwrite-Self--Hosted-F02E65?style=for-the-badge&logo=appwrite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**A production-grade, full-stack handmade goods marketplace where buyers discover unique products and independent sellers build thriving businesses.**

[Live Demo](#) · [Report Bug](https://github.com/aditya-2129/etsy-clone/issues) · [Request Feature](https://github.com/aditya-2129/etsy-clone/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Service Layer API](#-service-layer-api)
- [Features](#-features)
- [Route Map](#-route-map)
- [State Management](#-state-management)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

This is a **full-stack marketplace application** inspired by Etsy, built with a modern, scalable architecture. It supports a **three-tiered role-based access control (RBAC)** system:

- **Buyers (Default)** — Browse, search, filter, purchase handmade goods, leave reviews, and manage wishlists.
- **Sellers** — Create shops, list products, manage inventory, and fulfill orders. Access is restricted until shop approval.
- **Admins** — Full oversight of the marketplace. Manage users, approve/reject shops, curate featured products, and monitor orders/categories.

The application uses **Appwrite** as the Backend-as-a-Service (BaaS), providing authentication, a structured NoSQL database, and file storage — all self-hosted via Docker.

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose | Version |
|---|---|---|
| [Next.js](https://nextjs.org/) | React framework (App Router, SSR, ISR) | 16.2.3 |
| [React](https://react.dev/) | UI library | 19.2.4 |
| [TypeScript](https://www.typescriptlang.org/) | Type safety | 5.x |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS | 4.x |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible component primitives | 4.2.0 |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions | 12.x |
| [React Hook Form](https://react-hook-form.com/) | Performant form management | 7.x |
| [Zod](https://zod.dev/) | Schema validation | 4.x |
| [Sonner](https://sonner.emilkowal.dev/) | Toast notifications | 2.x |
| [Lucide React](https://lucide.dev/) | Icon library | 1.x |
| [nuqs](https://nuqs.47ng.com/) | Type-safe URL search params | 2.x |
| [Embla Carousel](https://www.embla-carousel.com/) | Product image carousel | 8.x |
| [React Masonry CSS](https://www.npmjs.com/package/react-masonry-css) | Pinterest-style grid layout | 1.x |
| [React Intersection Observer](https://www.npmjs.com/package/react-intersection-observer) | Scroll-triggered animations | 10.x |
| [React Loading Skeleton](https://www.npmjs.com/package/react-loading-skeleton) | Shimmer placeholders | 3.x |
| [@formkit/auto-animate](https://auto-animate.formkit.com/) | Automatic list animations | 0.9.x |
| [React Dropzone](https://react-dropzone.js.org/) | Drag-and-drop file upload | 15.x |
| [TanStack React Query](https://tanstack.com/query) | Client-side data caching | 5.x |

### Backend (Appwrite — Self-Hosted)

| Service | Purpose |
|---|---|
| **Auth** | Email/password + Google OAuth2 |
| **Databases** | Structured NoSQL collections with indexes |
| **Storage** | Image upload with on-the-fly transforms (resize, quality) |
| **Realtime** | WebSocket subscriptions (future) |

---

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Next.js Pages (Server Components) → Client Components      │
│  Navbar, Footer, ProductCard, CartDrawer, Forms, etc.        │
├─────────────────────────────────────────────────────────────┤
│                   STATE MANAGEMENT LAYER                     │
│  React Context (Auth, Cart, Theme)                          │
│  URL Search Params (Filters, Pagination, Search)            │
│  Local State (Forms, UI toggles)                            │
├─────────────────────────────────────────────────────────────┤
│                  SERVICE ABSTRACTION LAYER                   │
│  auth.service.ts │ product.service.ts │ order.service.ts    │
│  user.service.ts │ shop.service.ts    │ review.service.ts   │
│  cart.service.ts │ wishlist.service.ts │ storage.service.ts  │
│  category.service.ts │ admin.service.ts                      │
├─────────────────────────────────────────────────────────────┤
│                     APPWRITE SDK LAYER                       │
│  Client, Account, Databases, Storage, ID, Query             │
├─────────────────────────────────────────────────────────────┤
│                   APPWRITE BACKEND (Docker)                  │
│  MariaDB │ Redis │ ClamAV │ Traefik │ Workers               │
└─────────────────────────────────────────────────────────────┘
```

### Rendering Strategy

| Paradigm | When Used | Examples |
|---|---|---|
| **Server Components** (default) | Data fetching, SEO pages, static UI | Product pages, category listings, shop storefronts |
| **Client Components** (`"use client"`) | Interactivity, state, browser APIs | Search bar, add-to-cart button, image carousel, forms |

### Data Flow

```
User Request → Next.js Router (Server Component)
    → Service Function (e.g., getProductBySlug)
        → Appwrite SDK (databases.listDocuments)
            → Appwrite Server (Docker)
                → MariaDB
            ← Document Response
        ← Typed Product object
    ← Rendered HTML with hydration markers
← Full page delivered to browser
```

---

## 📁 Project Structure

```
etsy-clone/
├── .gitignore
├── README.md                           ← You are here
│
├── appwrite/                           # Appwrite Docker configuration
│   ├── docker-compose.yml
│   └── .env
│
└── frontend/                           # Next.js application
    ├── AGENTS.md                       # Project rules & coding conventions
    ├── appwrite.config.json            # Database schema (source of truth)
    ├── next.config.ts                  # Image domains, build config
    ├── package.json
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    │
    ├── public/                         # Static assets (favicon, OG images)
    │
    └── src/
        ├── middleware.ts               # Route protection (auth guard)
        │
        ├── app/                        # Next.js App Router
        │   ├── globals.css             # CSS variables, animations, tokens
        │   ├── layout.tsx              # Root layout (fonts, providers, toaster)
        │   ├── page.tsx                # Homepage
        │   ├── loading.tsx             # Global loading skeleton
        │   ├── error.tsx               # Global error boundary
        │   ├── not-found.tsx           # Custom 404 page
        │   │
        │   ├── (auth)/                 # Auth route group (no URL prefix)
        │   │   ├── login/page.tsx
        │   │   └── register/page.tsx
        │   │
        │   ├── (main)/                 # Public marketplace routes
        │   │   ├── search/page.tsx
        │   │   ├── category/[slug]/page.tsx
        │   │   ├── product/[slug]/page.tsx
        │   │   ├── shop/[slug]/page.tsx
        │   │   ├── cart/page.tsx
        │   │   └── checkout/page.tsx
        │   │
        │   ├── account/                # Buyer protected routes
        │   │   ├── page.tsx
        │   │   ├── orders/page.tsx
        │   │   ├── wishlist/page.tsx
        │   │   └── settings/page.tsx
        │   │
        │   ├── seller/                 # Seller protected routes
        │       ├── dashboard/page.tsx
        │       ├── products/page.tsx
        │       ├── products/new/page.tsx
        │       ├── products/[id]/edit/page.tsx
        │       ├── orders/page.tsx
        │       └── shop/settings/page.tsx
        │
        │   └── (admin)/                # Admin-only management routes
        │       ├── layout.tsx          # AdminShell sidebar layout
        │       ├── page.tsx            # Stats dashboard
        │       ├── users/page.tsx      # User suspension & role mgmt
        │       ├── shops/page.tsx      # Shop approvals & status
        │       ├── products/page.tsx   # Product features & visibility
        │       ├── orders/page.tsx     # Platform-wide order oversight
        │       └── categories/page.tsx # Category CRUD management
        │
        ├── components/
        │   ├── layout/                 # Global layout components
        │   │   ├── Navbar.tsx          # Sticky header, search, cart badge
        │   │   └── Footer.tsx          # Links, value props, localization
        │   │
        │   ├── shared/                 # Reusable across domains
        │   │   ├── PriceTag.tsx        # INR currency + compare-at-price
        │   │   ├── RatingStars.tsx     # Full/half/empty stars + count
        │   │   ├── EmptyState.tsx      # Generic empty state component
        │   │   └── LoadingSkeleton.tsx  # Shimmer skeletons (card, grid)
        │   │
        │   ├── product/               # Product domain
        │   │   ├── ProductCard.tsx     # Card with image, heart, price
        │   │   └── ProductGrid.tsx     # Responsive grid wrapper
        │   │
        │   ├── shop/                  # Shop domain
        │   │   └── ShopCard.tsx        # Banner, logo, rating preview
        │   │
        │   ├── cart/                   # Cart domain
        │   │   └── CartItemCard.tsx    # Quantity controls, remove
        │   │
        │   ├── order/                 # Order domain
        │   │   └── OrderCard.tsx       # Status badge, date, total
        │   │
        │   └── ui/                    # shadcn/ui primitives (DO NOT EDIT)
        │       ├── button.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       └── ... (40+ components)
        │
        ├── contexts/                   # React Context providers
        │   ├── AuthContext.tsx          # User state, login/logout
        │   └── CartContext.tsx          # Cart items, count, subtotal
        │
        ├── hooks/                      # Custom React hooks
        │   ├── use-mobile.ts           # Responsive breakpoint hook
        │   ├── useDebounce.ts          # Search input debounce (300ms)
        │   └── useWishlist.ts          # Toggle with optimistic UI
        │
        └── lib/                        # Core logic & utilities
            ├── appwrite.ts             # Appwrite SDK initialization
            ├── constants.ts            # All DB/Collection/Bucket IDs
            ├── utils.ts                # shadcn cn() utility
            │
            ├── types/
            │   └── index.ts            # 4 enums, 9 interfaces, 10 inputs, filters
            │
            ├── validations/
            │   └── index.ts            # 7 Zod schemas (auth, shop, product, etc.)
            │
            ├── utils/
            │   ├── formatters.ts       # formatPrice (INR), formatDate
            │   └── slugify.ts          # slugify, truncate, uniqueSlug
            │
            └── services/               # Appwrite CRUD abstraction layer
                ├── auth.service.ts     # register, login, logout, OAuth
                ├── user.service.ts     # CRUD, role upgrade
                ├── shop.service.ts     # CRUD, slug lookup, toggle active
                ├── category.service.ts # List, slug lookup
                ├── product.service.ts  # CRUD, search, filters, pagination
                ├── order.service.ts    # Composite create, status mgmt
                ├── review.service.ts   # CRUD, rating calculator
                ├── wishlist.service.ts # Add/remove/toggle/check
                ├── cart.service.ts     # Smart add, clear, quantity
                └── storage.service.ts  # Upload, delete, preview, batch
```

---

## 🗄️ Database Schema

### Collections (9 total)

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│    users     │     │    shops     │     │  categories  │
├─────────────┤     ├─────────────┤     ├──────────────┤
│ userId    PK│────▶│ sellerId  FK│     │ name         │
│ name        │     │ name        │     │ slug      UQ │
│ email       │     │ slug     UQ │     │ icon         │
│ role (enum) │     │ description │     │ description  │
│ avatar      │     │ banner      │     └──────────────┘
│ phone       │     │ logo        │           │
│ addresses   │     │ isActive    │           │
└─────────────┘     │ totalSales  │           │
       │            │ rating      │           │
       │            │ policies    │           │
       │            │ location    │           │
       │            └─────────────┘           │
       │                  │                   │
       │            ┌─────────────┐           │
       │            │  products   │           │
       │            ├─────────────┤           │
       │            │ shopId    FK│◀──────────┤
       │            │ sellerId  FK│           │
       │            │ title       │           │
       │            │ slug     UQ │           │
       │            │ description │           │
       │            │ price       │     categoryId FK
       │            │ compareAt   │───────────┘
       │            │ images   [] │
       │            │ stock       │
       │            │ tags     [] │
       │            │ isPublished │
       │            │ totalSold   │
       │            │ rating      │
       │            │ shippingCost│
       │            │ processingT │
       │            │ materials[] │
       │            │ reviewCount │
       │            └─────────────┘
       │                  │
       │    ┌─────────────┼──────────────┐
       │    │             │              │
  ┌────▼────▼──┐   ┌─────▼─────┐  ┌─────▼──────┐
  │   orders   │   │  reviews  │  │  wishlist   │
  ├────────────┤   ├───────────┤  ├────────────┤
  │ buyerId  FK│   │ productId │  │ buyerId  FK│
  │ status     │   │ buyerId   │  │ productId  │
  │ totalAmount│   │ rating    │  │ (composite │
  │ shippingAdd│   │ comment   │  │  unique)   │
  │ paymentMeth│   │ reviewer  │  └────────────┘
  │ paymentStat│   │  Name     │
  │ trackingNum│   └───────────┘  ┌────────────┐
  │ notes      │                  │    cart     │
  └────────────┘                  ├────────────┤
       │                          │ buyerId  FK│
  ┌────▼───────┐                  │ productId  │
  │ order-items│                  │ shopId     │
  ├────────────┤                  │ sellerId   │
  │ orderId  FK│                  │ quantity   │
  │ productId  │                  │ (composite │
  │ shopId     │                  │  unique)   │
  │ sellerId   │                  └────────────┘
  │ title      │
  │ price      │
  │ quantity   │
  │ subtotal   │
  │ status     │
  └────────────┘
```

### Storage Buckets (3 total)

| Bucket | ID | Max Size | Formats |
|---|---|---|---|
| Product Images | `product-images` | 5 MB | jpg, png, webp |
| Shop Assets | `shop-assets` | 5 MB | jpg, png, webp |
| User Avatars | `user-avatars` | 2 MB | jpg, png, webp |

### Indexes

| Collection | Index Name | Type | Fields |
|---|---|---|---|
| users | `userId_idx` | Key | `userId` |
| shops | `slug_unique` | Unique | `slug` |
| shops | `sellerId_idx` | Key | `sellerId` |
| products | `slug_unique` | Unique | `slug` |
| products | `shopId_idx` | Key | `shopId` |
| products | `categoryId_idx` | Key | `categoryId` |
| products | `title_search` | Fulltext | `title` |
| orders | `buyerId_idx` | Key | `buyerId` |
| order-items | `orderId_idx` | Key | `orderId` |
| order-items | `sellerId_idx` | Key | `sellerId` |
| reviews | `productId_idx` | Key | `productId` |
| wishlist | `buyerId_productId_unique` | Unique | `buyerId`, `productId` |
| cart | `buyerId_productId_unique` | Unique | `buyerId`, `productId` |

---

## ⚙️ Service Layer API

Every service function is typed end-to-end (input → output). The UI never calls Appwrite directly.

### auth.service.ts

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `register` | `email, password, name` | `User` | Creates account + user document |
| `login` | `email, password` | `Session` | Email/password login |
| `logout` | — | `void` | Deletes active session |
| `getCurrentAccount` | — | `Account \| null` | Gets Appwrite account |
| `getCurrentUser` | — | `User \| null` | Gets user database document |
| `loginWithGoogle` | — | `void` | Redirects to Google OAuth |

### product.service.ts

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `createProduct` | `CreateProductInput` | `Product` | Creates listing with permissions |
| `getProductBySlug` | `slug` | `Product` | Slug-based lookup |
| `getProductById` | `documentId` | `Product` | ID-based lookup |
| `listProducts` | `ProductFilters` | `PaginatedResponse<Product>` | Filtered, sorted, paginated |
| `searchProducts` | `query, limit` | `Product[]` | Fulltext search on title |
| `getProductsByShop` | `shopId, publishedOnly` | `Product[]` | Shop's products |
| `updateProduct` | `documentId, UpdateProductInput` | `Product` | Update fields |
| `deleteProduct` | `documentId` | `void` | Delete listing |
| `togglePublish` | `documentId, isPublished` | `Product` | Publish/unpublish |
| `updateProductAfterPurchase` | `documentId, qty` | `Product` | Decrement stock, increment sales |

### order.service.ts

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `createOrder` | `CreateOrderInput, items[]` | `{ order, orderItems }` | Composite order + items creation |
| `getOrdersByBuyer` | `buyerId` | `Order[]` | Buyer's order history |
| `getOrderById` | `documentId` | `Order` | Single order |
| `getOrderItems` | `orderId` | `OrderItem[]` | Items in an order |
| `getOrderItemsBySeller` | `sellerId` | `OrderItem[]` | Seller's incoming orders |
| `updateOrderStatus` | `documentId, status` | `Order` | Change order status |
| `updateOrderItemStatus` | `documentId, status` | `OrderItem` | Change item status |
| `addTrackingNumber` | `documentId, trackingNumber` | `Order` | Add tracking |

### cart.service.ts

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `addToCart` | `AddToCartInput` | `CartItem` | Smart add (auto-increments if exists) |
| `updateCartQuantity` | `documentId, quantity` | `CartItem` | Update qty (auto-removes if 0) |
| `removeFromCart` | `documentId` | `void` | Remove single item |
| `getCart` | `buyerId` | `CartItem[]` | All cart items |
| `clearCart` | `buyerId` | `void` | Remove all items (post-checkout) |
| `getCartCount` | `buyerId` | `number` | Total quantity for badge |

<details>
<summary><strong>View all services (shop, user, category, review, wishlist, storage)</strong></summary>

### shop.service.ts

| Function | Returns | Description |
|---|---|---|
| `createShop(data)` | `Shop` | Creates shop with seller permissions |
| `getShopBySlug(slug)` | `Shop` | Public slug lookup |
| `getShopsBySellerId(sellerId)` | `Shop[]` | Seller's shops |
| `updateShop(id, data)` | `Shop` | Update details |
| `toggleShopActive(id, bool)` | `Shop` | Activate/deactivate |
| `listActiveShops(limit)` | `Shop[]` | Marketplace browsing |

### user.service.ts

| Function | Returns | Description |
|---|---|---|
| `createUserDocument(data)` | `User` | Creates user profile |
| `getUserByUserId(userId)` | `User` | Lookup by auth ID |
| `updateUser(id, data)` | `User` | Update profile |
| `upgradeToSeller(id)` | `User` | Change role to seller |

### category.service.ts

| Function | Returns | Description |
|---|---|---|
| `listCategories()` | `Category[]` | All categories, sorted |
| `getCategoryBySlug(slug)` | `Category` | Slug lookup |
| `getCategoryById(id)` | `Category` | ID lookup |

### review.service.ts

| Function | Returns | Description |
|---|---|---|
| `createReview(data)` | `Review` | Submit review |
| `getReviewsByProduct(productId)` | `Review[]` | Product reviews |
| `getReviewsByBuyer(buyerId)` | `Review[]` | User's reviews |
| `updateReview(id, data)` | `Review` | Edit review |
| `deleteReview(id)` | `void` | Remove review |
| `calculateProductRating(productId)` | `{ average, count }` | Compute avg rating |

### wishlist.service.ts

| Function | Returns | Description |
|---|---|---|
| `addToWishlist(buyerId, productId)` | `WishlistItem` | Idempotent add |
| `removeFromWishlist(id)` | `void` | Remove item |
| `getWishlist(buyerId)` | `WishlistItem[]` | All favorites |
| `isInWishlist(buyerId, productId)` | `WishlistItem \| null` | Check if saved |
| `toggleWishlist(buyerId, productId)` | `{ action, item }` | Toggle in/out |

### storage.service.ts

| Function | Returns | Description |
|---|---|---|
| `uploadFile(bucketId, file)` | `File` | Upload single file |
| `deleteFile(bucketId, fileId)` | `void` | Delete file |
| `getFilePreview(bucketId, fileId, opts)` | `string` | Preview URL with transforms |
| `getFileUrl(bucketId, fileId)` | `string` | Direct download URL |
| `uploadMultipleFiles(bucketId, files)` | `string[]` | Batch upload |
| `deleteMultipleFiles(bucketId, fileIds)` | `void` | Batch delete |

</details>

---

## ✨ Features

### 🛒 Buyer Experience

| Feature | Description |
|---|---|
| **Product Discovery** | Search with fulltext, filter by category/price/rating, sort by newest/popular/price |
| **Product Detail** | Image gallery, pricing, reviews, shop info, related products |
| **Shopping Cart** | Add/remove items, quantity management, smart duplicate handling |
| **Wishlist** | Heart toggle on any product, persistent across sessions |
| **Checkout** | Multi-step form with shipping address, payment method selection |
| **Order History** | Track order status (pending → confirmed → shipped → delivered) |
| **Reviews** | Rate products 1-5 stars with optional comment |
| **User Profile** | Edit name, phone, addresses |

### 🏪 Seller Experience

| Feature | Description |
|---|---|
| **Shop Management** | Create shop with name, slug, banner, logo, policies |
| **Product Listings** | Create/edit products with images, pricing, inventory, tags, materials |
| **Inventory Control** | Stock management, publish/unpublish toggle |
| **Order Fulfillment** | View incoming orders, update status, add tracking numbers |
| **Dashboard** | Sales metrics, order stats, product performance |

### 🛠️ Admin Experience

| Feature | Description |
|---|---|
| **Platform Dashboard** | Real-time overview of users, shops, products, and revenue |
| **User Management** | List all users, change roles, suspend/unsuspend accounts |
| **Shop Approvals** | Review pending shops, approve for marketplace, or revoke access |
| **Product Curation** | Toggle featured status for homepage, manage global visibility |
| **Category Management** | Full CRUD for marketplace categories with auto-slugs |
| **Order Oversight** | Platform-wide view of all orders and fulfillment statuses |

### 🔐 Authentication & Security

| Feature | Description |
|---|---|
| **Email/Password** | Standard registration with Zod-validated forms |
| **Google OAuth** | One-click sign in via Google |
| **Route Protection** | Middleware guards `/account/*`, `/seller/*`, `/checkout` |
| **Row-Level Security** | Document permissions ensure data isolation |
| **Session Management** | Appwrite cookie-based sessions |

### 🎨 UI/UX

| Feature | Description |
|---|---|
| **Responsive Design** | Mobile-first with Tailwind breakpoints |
| **Skeleton Loading** | Shimmer placeholders for all async content |
| **Toast Notifications** | Success/error/info feedback via Sonner |
| **Animations** | Framer Motion page transitions, CSS micro-interactions |
| **Accessibility** | ARIA labels, keyboard navigation, focus management, 4.5:1 contrast |
| **Error Boundaries** | Graceful error handling with retry actions |
| **404 Page** | Custom not-found with navigation options |

---

## 🧭 Route Map

```
/                               Homepage (hero, categories, featured products)
│
├── /search?q=...&sort=...      Search results with filters
├── /category/[slug]            Category product listing
├── /product/[slug]             Product detail page (PDP)
├── /shop/[slug]                Shop storefront
├── /cart                       Shopping cart
├── /checkout                   🔒 Secure checkout
│
├── /login                      Sign in (email + Google)
├── /register                   Create account
│
├── /account                    🔒 Buyer dashboard
│   ├── /orders                 Order history
│   ├── /wishlist               Saved items
│   └── /settings               Profile settings
│
├── /seller                     🔒 Seller dashboard (role: seller)
│   ├── /dashboard              Stats & metrics
│   ├── /products               Listings manager
│   │   ├── /new                Create listing
│   │   └── /[id]/edit          Edit listing
│   ├── /orders                 Incoming orders
│   └── /shop/settings          Shop configuration
│
└── /admin                      🔒 Admin panel (role: admin)
    ├── /users                  User management
    ├── /shops                  Shop approvals
    ├── /products               Product curation
    ├── /orders                 Order oversight
    └── /categories             Category manager
```

> 🔒 = Protected route (requires authentication via middleware)

---

## 🗺️ State Management

| State Type | Storage | Example |
|---|---|---|
| **Auth/User** | `AuthContext` | Current user, login status |
| **Cart** | `CartContext` + Appwrite | Items, count, subtotal |
| **Theme** | `next-themes` | Dark/light mode |
| **Forms** | `react-hook-form` + `useState` | Input values, validation errors |
| **Filters/Search** | URL search params (`nuqs`) | `?q=rings&sort=price_desc&page=2` |
| **UI State** | Local `useState` | Modal open, dropdown visible |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Docker** & Docker Compose ([download](https://www.docker.com/))
- **Appwrite CLI** (`npm install -g appwrite-cli`)

### 1. Clone the Repository

```bash
git clone https://github.com/aditya-2129/etsy-clone.git
cd etsy-clone
```

### 2. Start Appwrite (Backend)

```bash
cd appwrite
docker compose up -d
```

Wait for all containers to be healthy, then access the Appwrite Console at `http://localhost`.

### 3. Configure Appwrite Project

1. Open `http://localhost` → Create a project named **"Etsy Clone"** with ID `etsy-clone`
2. Go to **Auth → Settings** → Enable **Email/Password** and **Google OAuth**
3. For Google OAuth, set up credentials in [Google Cloud Console](https://console.cloud.google.com/)

### 4. Deploy Database Schema

```bash
cd frontend
appwrite login
appwrite push tables
appwrite push buckets
```

### 5. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔐 Environment Variables

Create `frontend/.env`:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=etsy-clone
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=Etsy Clone
```

> ⚠️ **Never commit `.env` to git.** It's already in `.gitignore`.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `appwrite push tables` | Deploy database schema |
| `appwrite push buckets` | Deploy storage buckets |

---

## 🎨 Design System

### CSS Custom Properties

All design tokens are defined in `globals.css` as CSS variables:

```css
:root {
  --etsy-orange: #F56400;        /* Primary brand color */
  --etsy-orange-hover: #CC5200;  /* Hover state */
  --etsy-success: #2ECC71;       /* Success actions */
  --etsy-error: #E74C3C;         /* Error states */
  --etsy-warning: #F39C12;       /* Warning alerts */
  --max-width: 1280px;           /* Content max width */
  --navbar-height: 64px;         /* Sticky header height */
}
```

### Typography

| Font | Usage | Source |
|---|---|---|
| **Inter** | Body text, UI labels | Google Fonts |
| **Outfit** | Headings, hero text | Google Fonts |

### Component Library

Built on [shadcn/ui](https://ui.shadcn.com/) with 40+ accessible primitives. Custom components extend these with marketplace-specific logic.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow conventions in `AGENTS.md`
4. Commit with conventional messages (`feat:`, `fix:`, `docs:`)
5. Push and open a Pull Request

### Coding Standards

- All rules documented in [`AGENTS.md`](frontend/AGENTS.md)
- TypeScript strict mode — no `any`, no `@ts-ignore`
- Functional components with React Hooks only
- Services abstract ALL Appwrite calls
- CSS variables for ALL design tokens
- Mobile-first responsive design

---

## 📄 License

This project is for **educational purposes** only. Not affiliated with Etsy, Inc.

---

<div align="center">
  <sub>Built with ❤️ using Next.js, Appwrite, and Tailwind CSS</sub>
</div>
