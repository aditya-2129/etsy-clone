import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showCount?: boolean;
}

const sizeMap = {
  xs: "h-2.5 w-2.5",
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function RatingStars({
  rating,
  count,
  size = "md",
  showCount = true,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeMap[size]} fill-[var(--etsy-orange)] text-[var(--etsy-orange)]`}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${sizeMap[size]} text-muted-foreground/30`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={`${sizeMap[size]} fill-[var(--etsy-orange)] text-[var(--etsy-orange)]`}
              />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeMap[size]} text-muted-foreground/30`}
          />
        ))}
      </div>

      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
