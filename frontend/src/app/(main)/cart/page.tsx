"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/shared/PriceTag";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";

export default function CartPage() {
  const { items, itemCount, subtotal, isLoading, updateQuantity, removeItem } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const shipping = subtotal > 5000 ? 0 : itemCount > 0 ? 50 : 0; // Free shipping over 5k
  const total = subtotal + shipping;

  if (!isClient) return null;

  if (isLoading && itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
        <p className="text-muted-foreground animate-pulse text-lg">Loading your cart treasures...</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Looks like you haven't added anything to your cart yet. Wander around and find something you love!
          </p>
        </div>
        <Link href="/">
          <Button className="px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          Your Cart <span className="text-muted-foreground font-normal">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        </h1>
        <Link href="/" className="text-sm font-medium text-[var(--etsy-orange)] hover:underline flex items-center gap-1">
          Keep shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.$id}
                title={item.product?.title || "Product"}
                price={item.product?.price || 0}
                quantity={item.quantity}
                shopName="Verified Seller" // TODO: Add shop name to item fetch if needed
                onIncrement={() => updateQuantity(item.$id, item.quantity + 1)}
                onDecrement={() => updateQuantity(item.$id, Math.max(1, item.quantity - 1))}
                onRemove={() => removeItem(item.$id)}
                disableIncrement={item.product ? item.quantity >= item.product.stock : false}
                // Support image from product or placeholder
                imageUrl={item.product?.images?.[0] ? getFilePreview(BUCKET_PRODUCT_IMAGES, item.product.images[0], { width: 240, height: 240 }) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm sticky top-24">
            <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <PriceTag price={subtotal} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-[var(--etsy-success)] font-medium">Free</span> : <PriceTag price={shipping} />}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total</span>
                <PriceTag price={total} className="text-xl" />
              </div>
            </div>

            <Link href="/checkout" className="block mt-8">
              <Button className="w-full py-7 rounded-full text-lg font-bold shadow-lg bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] transition-all hover:scale-[1.01] active:scale-[0.99] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Proceed to Checkout
              </Button>
            </Link>

            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-xs text-center text-muted-foreground">
                All eligible items will be shipped securely to your provided address.
              </p>
              <div className="flex gap-2 grayscale opacity-50">
                {/* Payment Icons Placeholder */}
                <div className="w-8 h-5 bg-muted rounded"></div>
                <div className="w-8 h-5 bg-muted rounded"></div>
                <div className="w-8 h-5 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
