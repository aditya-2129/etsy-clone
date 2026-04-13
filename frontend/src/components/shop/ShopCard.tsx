import Link from "next/link";
import { RatingStars } from "@/components/shared/RatingStars";
import type { Shop } from "@/lib/types";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className="group rounded-lg border bg-card overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow"
    >
      {/* Banner */}
      <div className="h-24 bg-muted">
        {/* TODO: next/image with shop.banner */}
      </div>

      {/* Info */}
      <div className="p-4 flex items-start gap-3">
        {/* Logo */}
        <div className="h-12 w-12 rounded-full bg-muted border-2 border-background -mt-8 flex-shrink-0" />
        <div className="space-y-1">
          <h3 className="font-semibold group-hover:text-[var(--etsy-orange)] transition-colors">
            {shop.name}
          </h3>
          <RatingStars rating={shop.rating} size="sm" showCount={false} />
          {shop.location && (
            <p className="text-xs text-muted-foreground">{shop.location}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
