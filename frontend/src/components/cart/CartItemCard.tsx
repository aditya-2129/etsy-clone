import { Trash2, Plus, Minus } from "lucide-react";
import { PriceTag } from "@/components/shared/PriceTag";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CartItemCardProps {
  title: string;
  price: number;
  quantity: number;
  shopName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  isUpdating?: boolean;
  imageUrl?: string;
  disableIncrement?: boolean;
}

export function CartItemCard({
  title,
  price,
  quantity,
  shopName,
  onIncrement,
  onDecrement,
  onRemove,
  isUpdating = false,
  imageUrl,
  disableIncrement = false,
}: CartItemCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:border-[var(--etsy-orange)] transition-colors group">
      {/* Image */}
      <div className="h-28 w-28 rounded-lg bg-muted flex-shrink-0 relative overflow-hidden ring-1 ring-border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] bg-muted uppercase tracking-widest">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1 py-1">
        <div className="flex justify-between items-start gap-4">
          <p className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-[var(--etsy-orange)] transition-colors">
            {title}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
            onClick={onRemove}
            disabled={isUpdating}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Sold by <span className="underline decoration-muted-foreground/30 hover:decoration-[var(--etsy-orange)] hover:text-[var(--etsy-orange)] cursor-pointer">{shopName}</span>
        </p>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <PriceTag price={price} className="text-lg font-bold" />
          
          <div className="flex items-center gap-1 bg-muted/30 rounded-full p-1 border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-background shadow-sm disabled:opacity-30"
              onClick={onDecrement}
              disabled={isUpdating || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-bold w-8 text-center tabular-nums">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-background shadow-sm disabled:opacity-30"
              onClick={onIncrement}
              disabled={isUpdating || disableIncrement}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
