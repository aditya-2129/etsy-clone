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
  
  const imageUrl = product.images?.[0] 
    ? getFilePreview(BUCKET_PRODUCT_IMAGES, product.images[0], { width: 400, height: 400 })
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-[var(--etsy-orange)]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-offset-background",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/40">No Image</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="bg-[var(--etsy-success)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              SALE
            </span>
          )}
          {product.totalSold > 50 && (
            <span className="bg-white/95 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-border/50">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart Overlay */}
        <button
          className={cn(
            "absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-foreground/70 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-red-500 hover:scale-110 shadow-md transform translate-y-2 group-hover:translate-y-0 disabled:cursor-not-allowed",
            isWishlisted(product.$id) && "opacity-100 text-red-500"
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
      <div className="p-4 space-y-2.5">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground/90 group-hover:text-[var(--etsy-orange)] transition-colors duration-200">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <RatingStars
              rating={product.rating}
              count={product.reviewCount}
              size="xs"
              showCount={false}
            />
            <span className="text-[10px] font-medium text-muted-foreground/80">({product.reviewCount})</span>
          </div>
        </div>

        <div className="pt-1 flex items-baseline justify-between gap-2">
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            className="font-bold text-base"
          />
          {product.shippingCost === 0 && (
            <span className="text-[10px] font-bold text-[var(--etsy-success)] uppercase tracking-tight">
              Free Shipping
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
