"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { PriceTag } from "@/components/shared/PriceTag";
import { RatingStars } from "@/components/shared/RatingStars";
import type { Product } from "@/lib/types";
import { getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toggle, isLoading: wishLoading, isWishlisted } = useWishlist();
  const isOutOfStock = product.stock <= 0;
  const isOnSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const savingsPercent = isOnSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  
  const imageUrl = product.images?.[0] 
    ? getFilePreview(BUCKET_PRODUCT_IMAGES, product.images[0], { width: 400, height: 400 })
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group block w-full max-w-[290px] overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(252,249,244,0.96))] shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 ring-offset-background",
        isOutOfStock
          ? "hover:border-black/10"
          : "hover:-translate-y-1.5 hover:border-[var(--etsy-orange)]/25 hover:shadow-[0_18px_40px_rgba(249,115,22,0.14)]",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden border-b border-black/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(245,240,233,0.92)_58%,rgba(237,231,221,0.9))] p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-white/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={cn(
                "object-cover transition-transform duration-500",
                isOutOfStock ? "scale-[0.96] opacity-55 grayscale-[0.2]" : "group-hover:scale-105"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted/40">
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground/50">No Image</span>
            </div>
          )}
        </div>

        {/* Badges Overlay */}
        <div className="absolute left-4 top-4 flex max-w-[70%] flex-col gap-1.5 pointer-events-none">
          {isOutOfStock && (
            <span className="inline-flex w-fit items-center rounded-full bg-[#1f1f1f] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg">
              Out of stock
            </span>
          )}
          {!isOutOfStock && isOnSale && (
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-md">
              Save {savingsPercent}%
            </span>
          )}
          {product.totalSold > 50 && (
            <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[16px] bg-[linear-gradient(135deg,rgba(20,20,20,0.88),rgba(58,58,58,0.75))] px-3.5 py-2.5 text-white shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Currently unavailable
            </p>
            <p className="mt-1 text-[13px] font-medium text-white/95">
              This listing is sold through for now.
            </p>
          </div>
        )}

        {/* Wishlist Heart Overlay */}
        <button
          className={cn(
            "absolute right-4 top-4 rounded-full border border-black/10 bg-white/92 p-2 text-foreground/70 shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-all duration-300 hover:scale-105 hover:bg-white hover:text-red-500 disabled:cursor-not-allowed",
            !isWishlisted(product.$id) && "opacity-75 group-hover:opacity-100",
            isWishlisted(product.$id) && "text-red-500"
          )}
          aria-label={`Toggle ${product.title} wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.$id);
          }}
          disabled={wishLoading(product.$id)}
        >
          {wishLoading(product.$id) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={cn("h-4 w-4", isWishlisted(product.$id) && "fill-current")} />
          )}
        </button>
      </div>

      {/* Product Details */}
      <div className="space-y-2.5 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-foreground/90 transition-colors duration-200 group-hover:text-[var(--etsy-orange)]">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground/85">
            <RatingStars
              rating={product.rating}
              count={product.reviewCount}
              size="xs"
              showCount={false}
            />
            <span className="text-[10px] font-medium">({product.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 border-t border-black/8 pt-2.5">
          <div className="space-y-1">
            <PriceTag
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              className="font-bold text-base"
            />
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {isOutOfStock ? "Unavailable now" : product.shippingCost === 0 ? "Free shipping" : "Ready to ship"}
            </p>
          </div>
          {!isOutOfStock && isOnSale && (
            <span className="rounded-full bg-[rgba(249,115,22,0.12)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--etsy-orange)]">
              Deal
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
