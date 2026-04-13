import Link from "next/link";
import { Heart } from "lucide-react";
import { PriceTag } from "@/components/shared/PriceTag";
import { RatingStars } from "@/components/shared/RatingStars";
import type { Product } from "@/lib/types";
import { truncate } from "@/lib/utils/slugify";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-lg border bg-card overflow-hidden transition-shadow duration-[var(--transition-base)] hover:shadow-[var(--shadow-card-hover)]"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {/* TODO: Replace with next/image + Appwrite storage preview */}
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
          Product Image
        </div>

        {/* Wishlist Heart */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label={`Add ${product.title} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            // TODO: wire up useWishlist hook
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-2">
        <p className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-[var(--etsy-orange)] transition-colors">
          {truncate(product.title, 60)}
        </p>

        <RatingStars
          rating={product.rating}
          count={product.reviewCount}
          size="sm"
        />

        <PriceTag
          price={product.price}
          compareAtPrice={product.compareAtPrice}
        />

        {product.shippingCost === 0 && (
          <span className="text-xs font-medium text-[var(--etsy-success)]">
            Free shipping
          </span>
        )}
      </div>
    </Link>
  );
}
