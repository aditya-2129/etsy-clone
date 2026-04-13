import { Trash2, Plus, Minus } from "lucide-react";
import { PriceTag } from "@/components/shared/PriceTag";
import { Button } from "@/components/ui/button";

interface CartItemCardProps {
  title: string;
  price: number;
  quantity: number;
  shopName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  isUpdating?: boolean;
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
}: CartItemCardProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card">
      {/* Image placeholder */}
      <div className="h-24 w-24 rounded-md bg-muted flex-shrink-0" />

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-medium text-sm line-clamp-2">{title}</p>
        <p className="text-xs text-muted-foreground">{shopName}</p>
        <PriceTag price={price} className="mt-2" />
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          disabled={isUpdating}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDecrement}
            disabled={isUpdating || quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onIncrement}
            disabled={isUpdating}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
