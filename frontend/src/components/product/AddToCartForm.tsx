"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (quantity > product.stock) {
      toast.error("Not enough stock available");
      return;
    }

    try {
      setIsSubmitting(true);
      // Use the context helper which handles sync and toasts
      await addToCart(
        product.$id,
        product.shopId,
        product.sellerId,
        quantity
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-4 border-t border-b border-border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isSubmitting}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-12 h-8 text-center p-0 border-none focus-visible:ring-0 bg-transparent"
            readOnly
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock || isSubmitting}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isSubmitting || product.stock === 0}
          className="w-full bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] text-white rounded-full py-6 text-lg font-semibold shadow-md active:scale-[0.98] transition-all"
        >
          {product.stock === 0 ? (
            "Out of stock"
          ) : isSubmitting ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to cart
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="w-full rounded-full py-6 border-foreground hover:bg-muted transition-colors"
        >
          <Heart className="mr-2 h-5 w-5" />
          Add to wishlist
        </Button>
      </div>
      
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs text-[var(--etsy-error)] font-medium text-center">
          Only {product.stock} left in stock - order soon!
        </p>
      )}
    </div>
  );
}
