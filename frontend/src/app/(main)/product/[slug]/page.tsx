import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, listProducts } from "@/lib/services/product.service";
import { getShopById } from "@/lib/services/shop.service";
import { getReviewsByProduct } from "@/lib/services/review.service";
import { getCategoryById } from "@/lib/services/category.service";
import { ImageGallery } from "@/components/product/ImageGallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { RatingStars } from "@/components/shared/RatingStars";
import { PriceTag } from "@/components/shared/PriceTag";
import { ShopCard } from "@/components/shop/ShopCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Truck, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  ChevronRight,
  Share2,
  Heart,
  Info
} from "lucide-react";
import type { Product, Shop, Review, Category, PaginatedResponse } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: `${product.title} | Marketplace`,
      description: product.description.substring(0, 160),
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  let productRaw;
  try {
    productRaw = await getProductBySlug(slug);
  } catch (error) {
    console.error("Product not found:", error);
    notFound();
  }

  // Fetch related data in parallel
  const [shopRaw, reviewsRaw, relatedProductsRaw, categoryRaw] = await Promise.all([
    getShopById(productRaw.shopId),
    getReviewsByProduct(productRaw.$id),
    listProducts({ categoryId: productRaw.categoryId, limit: 6 }),
    getCategoryById(productRaw.categoryId).catch(() => null)
  ]);

  // Clean data for Client Components (Next.js requirement)
  const product: Product = JSON.parse(JSON.stringify(productRaw));
  const shop: Shop = JSON.parse(JSON.stringify(shopRaw));
  const reviews: Review[] = JSON.parse(JSON.stringify(reviewsRaw));
  const category: Category | null = categoryRaw ? JSON.parse(JSON.stringify(categoryRaw)) : null;
  const relatedProducts: PaginatedResponse<Product> = JSON.parse(JSON.stringify(relatedProductsRaw));

  const filteredRelated = relatedProducts.documents.filter((p: Product) => p.$id !== product.$id).slice(0, 4);

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <Link href="/" className="hover:text-foreground transition-colors">Market</Link>
        <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
          </>
        )}
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20">
        {/* Left: Product Images */}
        <div className="lg:col-span-7">
          <div className="sticky top-[calc(var(--navbar-height)+2rem)]">
            <ImageGallery images={product.images} title={product.title} />
            
            {/* Desktop Reviews Section */}
            <div className="hidden lg:block mt-24">
              <header className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    Reviews
                    <span className="text-muted-foreground font-normal text-lg">({product.reviewCount || 0})</span>
                  </h2>
                  <div className="mt-1 flex items-center gap-3">
                    <RatingStars rating={product.rating} showCount={false} />
                    <span className="text-sm font-medium">{product.rating.toFixed(1)} out of 5 stars</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border">
                  Reviews are limited to verified purchases
                </p>
              </header>
              
              {reviews.length > 0 ? (
                <div className="space-y-10">
                  {reviews.map((review: Review) => (
                    <div key={review.$id} className="border-b border-border pb-10 last:border-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg text-foreground/70">
                          {review.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-base">{review.reviewerName}</p>
                          <RatingStars rating={review.rating} size="sm" showCount={false} />
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(review.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-base italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed bg-muted/20 p-16 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg">No reviews yet. Share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-5">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {product.totalSold > 50 && (
                    <Badge variant="secondary" className="bg-[var(--etsy-success)]/10 text-[var(--etsy-success)] border-none font-semibold">
                      Bestseller
                    </Badge>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <Badge variant="secondary" className="bg-red-50 text-red-600 border-none font-semibold">
                      Low Stock
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Link href={`/shop/${shop.slug}`} className="group flex items-center gap-1.5 text-sm text-foreground/70 hover:text-[var(--etsy-orange)] transition-colors mb-3">
                  <span className="font-semibold underline decoration-foreground/20 group-hover:decoration-[var(--etsy-orange)]">{shop.name}</span>
                  <div className="flex items-center">
                    <RatingStars rating={shop.rating || 5} size="xs" showCount={false} />
                  </div>
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold font-heading leading-tight tracking-tight mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <RatingStars rating={product.rating} count={product.reviewCount} />
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    {product.totalSold}+ successful orders
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <PriceTag 
                  price={product.price} 
                  compareAtPrice={product.compareAtPrice}
                  className="text-4xl font-bold text-foreground tracking-tight" 
                />
                {product.compareAtPrice && (
                  <span className="px-2.5 py-0.5 bg-[var(--etsy-success)] text-white text-xs font-bold rounded-full">
                    SAVE {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <AddToCartForm product={product} />

            {/* Delivery & Protection Info */}
            <div className="space-y-5 rounded-2xl border bg-muted/30 p-8 shadow-sm">
              <div className="flex gap-5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold">Priority Shipping</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Estimated arrival: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-[var(--etsy-success)]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Marketplace Protection</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Shop with confidence. Your purchase is protected from checkout to delivery.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold">Returns & Exchanges</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hassle-free returns within 30 days. <button className="underline hover:text-foreground">Learn more</button>
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details Accrodion / List */}
            <div className="space-y-8 pt-4">
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                  {product.description}
                </div>
              </div>

              {product.materials && product.materials.length > 0 && (
                <div className="border-t border-border pt-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Materials & Quality</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {product.materials.map((mat: string) => (
                      <Badge key={mat} variant="outline" className="bg-white px-3 py-1 font-medium text-foreground/80 border-border">
                        {mat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Preview Segment */}
      <div className="mt-32 py-16 border-y border-border bg-muted/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-8">Meet your seller</h2>
            <ShopCard shop={shop} />
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-bold">About {shop.name}</h3>
            <p className="text-muted-foreground text-base leading-relaxed line-clamp-4">
              {shop.description || "Welcome to my shop! I create high-quality handmade items with love and care. Feel free to browse around and message me if you have any questions."}
            </p>
            <div className="flex gap-4">
              <Button className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold" asChild>
                <Link href={`/shop/${shop.slug}`}>
                  View Shop
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full px-8 border-foreground hover:bg-foreground hover:text-white transition-all font-semibold">
                Message Seller
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {filteredRelated.length > 0 && (
        <div className="mt-28">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold font-heading">You may also like</h2>
            <Link href={`/category/${category?.slug || ""}`} className="text-[var(--etsy-orange)] font-semibold hover:underline flex items-center gap-1 group">
              See more <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <ProductGrid products={filteredRelated} />
        </div>
      )}

      {/* Mobile Reviews Section */}
      <div className="lg:hidden mt-20 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews ({product.reviewCount || 0})</h2>
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.slice(0, 3).map((review: Review) => (
              <div key={review.$id} className="bg-muted/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold">
                    {review.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.reviewerName}</p>
                    <RatingStars rating={review.rating} size="xs" showCount={false} />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
            {reviews.length > 3 && (
              <Button variant="outline" className="w-full rounded-full">
                View all {reviews.length} reviews
              </Button>
            )}
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}

