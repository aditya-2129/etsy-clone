import { formatPrice } from "@/lib/utils/formatters";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
}

export function PriceTag({ price, compareAtPrice, className = "" }: PriceTagProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-bold text-lg text-foreground">
        {formatPrice(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
