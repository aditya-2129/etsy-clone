<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🛍️ Etsy Clone — Project Rules & Conventions

> This is the single source of truth for all coding conventions, architecture decisions, and design patterns in this project. Every contributor (human or AI) MUST follow these rules.

---

## 📁 Project Architecture

```
src/
├── app/                     # Next.js App Router pages & layouts
│   ├── globals.css          # Global CSS variables & base styles
│   ├── layout.tsx           # Root layout (providers, fonts, meta)
│   ├── page.tsx             # Homepage
│   ├── (auth)/              # Auth route group (login, register)
│   ├── (main)/              # Main marketplace routes
│   ├── seller/              # Seller dashboard routes
│   └── api/                 # API routes (if needed)
├── components/
│   ├── ui/                  # shadcn/ui base components (DO NOT EDIT)
│   ├── layout/              # Navbar, Footer, Sidebar
│   ├── product/             # ProductCard, ProductGrid, ProductDetail
│   ├── shop/                # ShopCard, ShopHeader
│   ├── cart/                # CartDrawer, CartItem
│   ├── order/               # OrderCard, OrderTimeline
│   └── shared/              # Reusable: SearchBar, RatingStars, PriceTag
├── hooks/                   # Custom React hooks
├── lib/
│   ├── appwrite.ts          # Appwrite client initialization
│   ├── constants.ts         # All IDs (DB, collections, buckets)
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces & enums
│   └── services/            # Appwrite CRUD service modules
│       ├── auth.service.ts
│       ├── user.service.ts
│       ├── shop.service.ts
│       ├── product.service.ts
│       ├── category.service.ts
│       ├── order.service.ts
│       ├── review.service.ts
│       ├── wishlist.service.ts
│       ├── cart.service.ts
│       └── storage.service.ts
└── contexts/                # React Context providers
    └── AuthContext.tsx
```

---

## 🎨 CSS & Styling Rules

### 1. Global CSS Variables (MANDATORY)

All design tokens MUST be defined as CSS custom properties in `globals.css`. **Never hardcode colors, spacing, or font values directly in components.**

```css
/* ✅ CORRECT — define in globals.css, use everywhere */
:root {
  --etsy-orange: #F56400;
  --etsy-orange-hover: #CC5200;
  --etsy-dark: #222222;
  --etsy-gray: #757575;
  --etsy-light-gray: #F5F5F5;
  --etsy-white: #FFFFFF;
  --etsy-success: #2ECC71;
  --etsy-error: #E74C3C;
  --etsy-warning: #F39C12;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-heading: 'Outfit', sans-serif;

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;

  /* Layout */
  --max-width: 1280px;
  --navbar-height: 64px;
  --sidebar-width: 280px;
}
```

### 2. Using CSS Variables in Tailwind

Use Tailwind's arbitrary value syntax to reference CSS variables:

```jsx
// ✅ CORRECT — reference CSS variables via Tailwind
<div className="bg-[var(--etsy-orange)] text-[var(--etsy-white)]" />
<div className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]" />
<div className="max-w-[var(--max-width)]" />

// ❌ WRONG — hardcoded values
<div className="bg-[#F56400] text-white" />
<div className="shadow-md hover:shadow-lg" />
```

### 3. Using CSS Variables in Custom CSS

```css
/* ✅ CORRECT */
.product-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-base);
}

.product-card:hover {
  box-shadow: var(--shadow-card-hover);
}

/* ❌ WRONG — hardcoded */
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

### 4. Styling Priority

1. **Tailwind utility classes** — first choice for all styling
2. **CSS variables via Tailwind** — `bg-[var(--etsy-orange)]` for design tokens
3. **Custom CSS classes** — only for complex animations/keyframes
4. **Inline styles** — NEVER (except truly dynamic computed values)

### 5. Responsive Breakpoints

Always design mobile-first using Tailwind breakpoints:

```jsx
// Mobile first → tablet → desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" />
```

| Breakpoint | Width | Usage |
|---|---|---|
| (default) | < 768px | Mobile |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Large desktop |

---

## 🧩 Component Rules

### 1. File Naming
- **Components**: `PascalCase.tsx` → `ProductCard.tsx`, `CartDrawer.tsx`
- **Services**: `camelCase.service.ts` → `auth.service.ts`
- **Hooks**: `camelCase.ts` → `useAuth.ts`, `useCart.ts`
- **Types**: `camelCase.ts` → `index.ts` (barrel export)
- **Utils**: `camelCase.ts` → `formatPrice.ts`, `slugify.ts`

### 2. Component Structure

Always use **functional components** with this order:

```tsx
"use client"; // Only if needed (interactivity, state, browser APIs)

// 1. External imports
import { useState, useEffect } from "react";
import Image from "next/image";

// 2. Internal imports (components)
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/shared/PriceTag";

// 3. Service/hook imports
import { getProductBySlug } from "@/lib/services/product.service";

// 4. Type imports
import type { Product } from "@/lib/types";

// 5. Props interface (if needed)
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

// 6. Component
export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // State
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => { /* ... */ }, []);

  // Handlers
  const handleAddToCart = async () => { /* ... */ };

  // Early returns
  if (!product) return null;

  // Render
  return ( /* JSX */ );
}
```

### 3. Server vs Client Components (Next.js App Router)

- **Default**: Server Component (no directive needed)
- **Add `"use client"`** ONLY when component uses: `useState`, `useEffect`, `onClick`, `onChange`, browser APIs
- **Pattern**: Keep data-fetching in Server Components, pass data down to Client Components

### 4. The "Rule of Three" (DRY)

If the same UI element or logic block appears **3 times**, extract it into:
- A reusable component (UI patterns) → `src/components/shared/`
- A custom hook (logic patterns) → `src/hooks/`
- A utility function (pure logic) → `src/lib/utils/`

---

## 🔧 Service Layer Rules

### 1. Structure

Every service file follows this pattern:

```typescript
import { databases, ID, Query } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTION_PRODUCTS } from "@/lib/constants";
import type { Product, CreateProductInput } from "@/lib/types";

/**
 * Creates a new product listing
 */
export async function createProduct(data: CreateProductInput): Promise<Product> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_PRODUCTS,
      ID.unique(),
      data
    );
    return doc as unknown as Product;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}
```

### 2. Rules

- **Named exports only** — no default exports, no classes
- **Every function** wraps Appwrite calls in `try/catch`
- **Never** import `databases`, `storage`, `account` directly in components — always go through services
- **Type everything** — inputs AND outputs must have TypeScript types
- **Document everything** — JSDoc comment above every exported function

### 3. Constants

All Appwrite IDs live in `src/lib/constants.ts`. **Never hardcode IDs anywhere else.**

```typescript
// ✅ CORRECT
import { DATABASE_ID, COLLECTION_PRODUCTS } from "@/lib/constants";

// ❌ WRONG
databases.createDocument("marketplace", "products", ...);
```

---

## 🔐 Security Rules

1. **No API keys** in code — use `process.env.NEXT_PUBLIC_*` for client-safe values
2. **No secrets** in `.env` committed to git — `.env` is in `.gitignore`
3. **Row-level security** — enabled on all user-data collections
4. **Permissions** — set on document creation via Appwrite SDK:

```typescript
import { Permission, Role } from "appwrite";

// Document-level permissions for user-owned data
const permissions = [
  Permission.read(Role.any()),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];
```

---

## ⚡ Performance Rules

1. **Images**: Always use `next/image` with proper `width`, `height`, and `alt`
2. **Lazy loading**: Use `loading="lazy"` for below-fold images
3. **No stray console.log()**: Remove all dev logs before committing
4. **Early returns**: Prefer flat code over nested `if/else`
5. **Loading states**: Every async action MUST show a loading indicator
6. **Error handling**: Every async action MUST have a user-facing error message (toast/alert)

---

## 📦 Package Management

- **NEVER** install packages directly via terminal
- **Always** suggest the install command and wait for manual approval
- **Current dependencies**: `appwrite` (SDK), `shadcn/ui` (components), `tailwindcss` (styling), `lucide-react` (icons)

---

## 🗄️ Appwrite Resource IDs

| Resource | ID |
|---|---|
| **Database** | `marketplace` |
| **Users** | `users` |
| **Shops** | `shops` |
| **Categories** | `categories` |
| **Products** | `products` |
| **Orders** | `orders` |
| **Order Items** | `order-items` |
| **Reviews** | `reviews` |
| **Wishlist** | `wishlist` |
| **Cart** | `cart` |
| **Product Images Bucket** | `product-images` |
| **Shop Assets Bucket** | `shop-assets` |
| **User Avatars Bucket** | `user-avatars` |

---

## 🏷️ Git Conventions

### Commit Messages
```
feat: add product search functionality
fix: cart quantity not updating
style: update product card hover animation
refactor: extract PriceTag shared component
docs: update AGENTS.md with CSS rules
```

### Branch Naming
```
feature/auth-flow
feature/product-listing
fix/cart-quantity-bug
```

---

## ♿ Accessibility (a11y) Rules

### 1. Semantic HTML

Always use the correct HTML element for its purpose:

```jsx
// ✅ CORRECT
<button onClick={handleClick}>Add to Cart</button>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<article>...</article>

// ❌ WRONG
<div onClick={handleClick}>Add to Cart</div>
<div className="nav">...</div>
```

### 2. ARIA Labels

Every interactive element MUST have an accessible label:

```jsx
// ✅ CORRECT
<button aria-label="Remove item from cart">
  <TrashIcon />
</button>
<input aria-label="Search products" placeholder="Search..." />

// ❌ WRONG — icon button with no label
<button><TrashIcon /></button>
```

### 3. Keyboard Navigation

- All interactive elements must be focusable via Tab
- All clickable elements must respond to Enter/Space
- Modals must trap focus and close on Escape
- Skip-link to main content at top of page

### 4. Color Contrast

- **Text**: Minimum 4.5:1 ratio against background
- **Large text** (18px+): Minimum 3:1 ratio
- **Never** rely on color alone to convey information — always pair with icons/text

### 5. Images

```jsx
// ✅ CORRECT — always provide meaningful alt text
<Image src={product.image} alt={`${product.title} - handmade product`} />

// ✅ CORRECT — decorative images
<Image src={divider} alt="" aria-hidden="true" />

// ❌ WRONG
<Image src={product.image} alt="image" />
<Image src={product.image} alt="" /> // (for non-decorative)
```

### 6. Focus Indicators

Never remove focus outlines. Customize them instead:

```css
/* ✅ CORRECT — visible, branded focus ring */
:focus-visible {
  outline: 2px solid var(--etsy-orange);
  outline-offset: 2px;
}

/* ❌ WRONG */
*:focus { outline: none; }
```

---

## 📝 Form Handling Patterns

### 1. Validation Strategy

- **Client-side**: Validate on blur (not on every keystroke) + on submit
- **Server-side**: Appwrite handles uniqueness/type constraints
- **Display errors**: Inline below the field, in red, with descriptive text

### 2. Form Component Pattern

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function CreateShopForm() {
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Shop name is required";
    if (formData.name.length > 128) newErrors.name = "Name must be under 128 characters";
    if (!formData.slug.match(/^[a-z0-9-]+$/)) newErrors.slug = "Slug must be lowercase with hyphens only";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // await createShop(formData);
      // toast.success("Shop created!");
    } catch (error) {
      // toast.error("Failed to create shop");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <Label htmlFor="shop-name">Shop Name *</Label>
        <Input
          id="shop-name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          onBlur={validate}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "shop-name-error" : undefined}
        />
        {errors.name && (
          <p id="shop-name-error" className="text-sm text-destructive mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Shop"
        )}
      </Button>
    </form>
  );
}
```

### 3. Form Rules

- Every `<Input>` MUST have a `<Label>` linked via `htmlFor`/`id`
- Every form MUST have `noValidate` (we handle validation ourselves)
- Every submit button MUST show loading state during submission
- **Never** use uncontrolled inputs — always use `value` + `onChange`
- Clear form errors on successful submission

---

## 🔔 Toast & Notification Patterns

### 1. When to Show Toasts

| Action | Toast Type | Example Message |
|---|---|---|
| Item added to cart | ✅ Success | "Added to cart!" |
| Order placed | ✅ Success | "Order placed successfully!" |
| Item removed | ℹ️ Info | "Item removed from wishlist" |
| Validation error | ❌ Error | "Please fill in all required fields" |
| Network error | ❌ Error | "Something went wrong. Please try again." |
| Duplicate action | ⚠️ Warning | "This item is already in your cart" |
| Destructive action | ⚠️ Confirm | "Are you sure you want to delete this product?" |

### 2. Toast Rules

- **Duration**: Success = 3s, Error = 5s (longer to read), Info = 3s
- **Position**: Bottom-right on desktop, bottom-center on mobile
- **Stacking**: Max 3 toasts visible at once
- **Never** show success toast + page redirect simultaneously — pick one
- **Never** use `alert()` or `console.log()` for user-facing messages
- **Destructive actions** (delete product, cancel order) MUST show a confirmation dialog first

### 3. Error Message Rules

```typescript
// ✅ CORRECT — user-friendly
"Unable to load products. Please check your connection and try again."

// ❌ WRONG — developer-speak
"Error: 500 Internal Server Error at GET /databases/marketplace/collections/products"

// ❌ WRONG — vague
"Something went wrong"
```

---

## 🧭 URL & Routing Conventions

### 1. Route Structure

```
/                           → Homepage (featured products, categories)
/search?q=handmade+jewelry  → Search results
/category/[slug]            → Category listing
/product/[slug]             → Product detail page
/shop/[slug]                → Shop storefront
/cart                       → Shopping cart
/checkout                   → Checkout flow

/(auth)/login               → Login page
/(auth)/register            → Register page

/seller/dashboard           → Seller dashboard
/seller/products            → Manage products
/seller/products/new        → Create product
/seller/products/[id]/edit  → Edit product
/seller/orders              → Incoming orders
/seller/shop/settings       → Shop settings

/account                    → Buyer account
/account/orders             → Order history
/account/wishlist           → Saved items
/account/settings           → Profile settings
```

### 2. URL Rules

- **Slugs over IDs** in public URLs: `/product/handmade-wooden-bowl` not `/product/6789abc`
- **IDs in seller routes**: `/seller/products/6789abc/edit` (not public-facing)
- **Query params** for filtering: `/search?q=rings&category=jewelry&minPrice=100&sort=newest`
- **Route groups** `(auth)` and `(main)` for shared layouts without affecting URL
- **All routes lowercase** with hyphens: `/seller/shop-settings` not `/seller/shopSettings`

### 3. Dynamic Route Pattern

```
src/app/
├── product/
│   └── [slug]/
│       └── page.tsx         → Server Component, fetches product by slug
├── category/
│   └── [slug]/
│       └── page.tsx         → Server Component, lists products by category
└── shop/
    └── [slug]/
        └── page.tsx         → Server Component, shop storefront
```

---

## 📊 Data Fetching Patterns

### 1. Server Components (Default — Read Operations)

```tsx
// src/app/product/[slug]/page.tsx — NO "use client" directive
import { getProductBySlug } from "@/lib/services/product.service";
import { getReviewsByProduct } from "@/lib/services/review.service";
import ProductDetail from "@/components/product/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const reviews = await getReviewsByProduct(product.$id);

  return <ProductDetail product={product} reviews={reviews} />;
}
```

### 2. Client Components (Mutations & Interactivity)

```tsx
"use client";

// Used for: add to cart, toggle wishlist, submit review, search input
export default function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await addToCart({ productId, quantity: 1, ... });
      // toast.success("Added to cart!");
    } catch (error) {
      // toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? <Loader2 className="animate-spin" /> : "Add to Cart"}
    </Button>
  );
}
```

### 3. Data Fetching Decision Tree

```
Is it a READ operation (display data)?
  └── YES → Server Component (default, no directive)
  └── NO (it's a WRITE/MUTATION)
        └── Use Client Component with loading/error states

Does it need real-time updates?
  └── YES → Client Component + useEffect with polling or Appwrite Realtime
  └── NO → Server Component with revalidation

Does it need user interaction to trigger?
  └── YES → Client Component (onClick, onChange, etc.)
  └── NO → Server Component
```

### 4. Rules

- **Never** use `useEffect` to fetch data that could be fetched server-side
- **Always** handle 3 states: loading, success, error
- **Pagination**: Use `Query.limit(25)` + `Query.offset(page * 25)` for offset-based
- **Caching**: Rely on Next.js built-in caching for Server Component fetches

---

## 🎬 Animation Standards

### 1. Duration Limits

| Type | Duration | Usage |
|---|---|---|
| **Micro-interactions** | 100-150ms | Button press, toggle, checkbox |
| **UI transitions** | 200-300ms | Dropdown, modal open, tab switch |
| **Page transitions** | 300-500ms | Route change, skeleton → content |
| **Decorative** | 500-1000ms | Hero animations, onboarding |

### 2. Easing Functions

```css
:root {
  /* Standard easings — use these, don't invent new ones */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);    /* most UI transitions */
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);         /* symmetric animations */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);      /* bouncy/playful */
}
```

### 3. Animation Rules

- **CSS transitions** for simple hover/focus effects
- **CSS `@keyframes`** for loading spinners, skeleton shimmer
- **Framer Motion** (if added) for complex page/layout animations
- **Never animate** `width`, `height`, `top`, `left` — use `transform` and `opacity` only (GPU-accelerated)
- **Respect `prefers-reduced-motion`**:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Common Animations

```css
/* Skeleton loading shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, var(--muted) 25%, var(--muted-foreground)/10 50%, var(--muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn var(--transition-base) var(--ease-out);
}
// ... rest of the code
---

## 🛠️ MCP Servers & Advanced Tooling

This project is equipped with **Model Context Protocol (MCP)** servers to enhance agent capabilities. Every agent MUST prioritize using these specialized tools before falling back to manual command-line execution or guessing.

### 1. Infrastructure & Backend
- **`docker`**: Use this to check container health, read logs from Appwrite, or restart services.
- **`appwrite-docs`**: Use this as the **single source of truth** for Appwrite SDK usage instead of guessing.
- **`vercel`**: Use this to manage deployments, check build logs, and handle environment variables on the cloud.

### 2. Logic & Knowledge
- **`sequential-thinking`**: Use this for multi-step architectural planning or debugging complex state issues.
- **`memory`**: Use this to persist project-specific context and user preferences across turns.
- **`fetch`**: Use this to read the latest documentation from Tailwind, Next.js, or external libraries.

### 3. UI & Frontend Development
- **`shadcn`**: Use this to browse the shadcn/ui registry and fetch components. **MANDATORY** for adding new UI elements.
- **`next-devtools-mcp`**: Use this to inspect the App Router tree, debug server/client component boundaries, and analyze component state.
- **`StitchMCP`**: Use this for high-fidelity screen generation and design system enforcement.
- **`chrome-devtools-mcp`**: Use this for visual regression testing, performance audits (Lighthouse), and DOM inspection.

### 4. File Management
- **`everything`**: Use this for near-instant file location on the local Windows machine.

---

## 🚀 Agent Workflow Priority

1. **Verify State**: Use `docker` and `next-devtools-mcp` to understand the current environment.
2. **Consult Docs**: Use `appwrite-docs` and `fetch` before writing service logic.
3. **Plan**: Use `sequential-thinking` for features involving more than 3 files.
4. **Enforce Design**: Use `shadcn` and `StitchMCP` to ensure UI consistency.
5. **Debug**: Use `chrome-devtools-mcp` and `vercel` logs for runtime issues.

### 2. Usage Pattern

```tsx
import Image from "next/image";
import { getFilePreview } from "@/lib/services/storage.service";

// Get optimized preview URL from Appwrite
const imageUrl = getFilePreview("product-images", product.images[0], {
  width: 400,
  height: 400,
  quality: 80,
});

// Render with next/image
<Image
  src={imageUrl}
  alt={product.title}
  width={400}
  height={400}
  className="object-cover rounded-lg"
  loading="lazy"    // below fold
  priority={false}  // set true ONLY for hero/LCP images
/>
```

### 3. Image Rules

- **Always** use `next/image` — never raw `<img>` tags
- **Always** specify `width` + `height` to prevent layout shift
- **Always** provide descriptive `alt` text
- **Hero/LCP images**: `priority={true}`, `loading="eager"`
- **Product grids**: `loading="lazy"` (default)
- **Max upload sizes**: Products = 5MB, Shop assets = 5MB, Avatars = 2MB
- **Allowed formats**: jpg, jpeg, png, webp only
- **Appwrite previews**: Use `getFilePreview` with width/height/quality for responsive images

---

## 📐 TypeScript Strictness Rules

### 1. Banned Patterns

```typescript
// ❌ NEVER use `any`
const data: any = await fetchData();

// ❌ NEVER use @ts-ignore
// @ts-ignore
someFunction();

// ❌ NEVER use non-null assertion carelessly
const name = user!.name;

// ❌ NEVER use type assertion without validation
const product = data as Product;
```

### 2. Required Patterns

```typescript
// ✅ Use proper typing
const data: Product[] = await listProducts();

// ✅ Use type guards
function isProduct(data: unknown): data is Product {
  return typeof data === "object" && data !== null && "title" in data;
}

// ✅ Use optional chaining
const name = user?.name ?? "Anonymous";

// ✅ Use discriminated unions for states
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

### 3. Rules

- **All function params** must be typed — no implicit `any`
- **All return types** must be explicit on service functions
- **Interfaces over type aliases** for object shapes (extendable)
- **Enums** for fixed sets of values (UserRole, OrderStatus)
- **`unknown` over `any`** when type is uncertain — forces type narrowing
- **Strict null checks** — handle `null`/`undefined` explicitly

---

## 🗺️ State Management Patterns

### 1. Decision Matrix

| State Type | Where to Store | Example |
|---|---|---|
| **Auth/User** | React Context (`AuthContext`) | Current user, login status |
| **Theme** | React Context (`ThemeContext`) | Dark/light mode |
| **Form data** | Local `useState` | Input values, validation errors |
| **UI state** | Local `useState` | Modal open/close, dropdown visible |
| **Server data** | Server Components (preferred) | Product lists, categories |
| **Filters/Search** | URL search params | `?q=rings&sort=newest&page=2` |
| **Cart** | React Context (`CartContext`) + Appwrite | Cart items, quantities |

### 2. Context Pattern

```tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser } from "@/lib/services/auth.service";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  // ... login, logout implementations

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook with safety check
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

### 3. Rules

- **Never** prop-drill more than 2 levels — use Context instead
- **Never** put server-fetchable data in Context — use Server Components
- **URL params** for anything the user should be able to bookmark/share
- **Local state** unless 2+ components need the same data
- **Context** only for truly global concerns (auth, cart, theme)

---

## 🧪 Testing Readiness

### 1. File Structure

```
src/
├── lib/services/
│   ├── product.service.ts
│   └── __tests__/
│       └── product.service.test.ts
├── components/product/
│   ├── ProductCard.tsx
│   └── __tests__/
│       └── ProductCard.test.tsx
```

### 2. What to Test (Priority Order)

| Priority | What | Why |
|---|---|---|
| 🔴 High | Service functions | Core business logic |
| 🔴 High | Utility functions | Pure functions, easy to test |
| 🟡 Medium | Custom hooks | Shared logic |
| 🟡 Medium | Form validation | User-facing errors |
| 🟢 Low | Component rendering | Visual, hard to maintain |

### 3. Test Naming Convention

```typescript
describe("ProductService", () => {
  describe("getProductBySlug", () => {
    it("should return a product when slug exists", async () => { ... });
    it("should throw when slug does not exist", async () => { ... });
    it("should not return unpublished products", async () => { ... });
  });
});
```

---

## 🌐 Internationalization (i18n) Readiness

### 1. Currency Formatting

**Always** use `Intl.NumberFormat` — never concatenate `₹` manually:

```typescript
// ✅ CORRECT — create a shared utility
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Usage: formatPrice(1499.5) → "₹1,499.50"

// ❌ WRONG
`₹${price}`
`₹${price.toFixed(2)}`
```

### 2. Date Formatting

```typescript
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

// Usage: formatDate("2026-04-14T00:00:00Z") → "14 Apr 2026"
```

### 3. Rules

- **No hardcoded strings** in components for labels that may be translated later
- **No hardcoded currency symbols** — use `formatPrice()` utility
- **No hardcoded date formats** — use `formatDate()` utility
- **RTL-ready layouts** — use `gap`, `flex`, `grid` instead of `margin-left`/`padding-right`

---

## 📈 Analytics Event Naming

### 1. Convention

Use `object_action` format:

```typescript
// Standard events
"product_viewed"
"product_added_to_cart"
"product_removed_from_cart"
"product_wishlisted"
"search_performed"
"order_placed"
"review_submitted"
"shop_created"
"user_registered"
"user_logged_in"
```

### 2. Event Properties

```typescript
// Always include these for product events
{
  product_id: string;
  product_title: string;
  category: string;
  price: number;
  shop_id: string;
}
```

---

## 🔄 Caching Strategy

### 1. Next.js Caching

```tsx
// Static pages — revalidate every 5 minutes
export const revalidate = 300;

// Dynamic pages — no caching
export const dynamic = "force-dynamic";
```

### 2. Appwrite Query Caching

- **Categories**: Cache aggressively (rarely change) — fetch once, store in Context
- **Products**: Cache moderately — revalidate on page visit
- **Cart/Orders**: Never cache — always fetch fresh
- **User profile**: Cache in AuthContext, refresh on mutations

### 3. Rules

- **Public pages** (homepage, categories, product listings): Cache with revalidation
- **Private pages** (cart, orders, account): No cache, always fresh
- **After mutations** (create/update/delete): Revalidate affected pages
- **Search results**: No cache (dynamic by nature)

---

*Last updated: April 14, 2026*

