"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlistContext } from "@/contexts/WishlistContext";
import { getProductsByIds } from "@/lib/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { wishlistIds, isLoading: listLoading } = useWishlistContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const ids = Array.from(wishlistIds);
      if (ids.length === 0) {
        setProducts([]);
        return;
      }

      setIsLoadingProducts(true);
      try {
        const data = await getProductsByIds(ids);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    if (!authLoading && !listLoading) {
      fetchProducts();
    }
  }, [wishlistIds, authLoading, listLoading]);

  if (authLoading || listLoading || (isLoadingProducts && products.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">My Wishlist</h1>
          <p className="text-muted-foreground text-lg">
            {products.length} {products.length === 1 ? "item" : "items"} you've favorited
          </p>
        </div>
        {products.length > 0 && (
          <Button asChild variant="outline" className="rounded-full shadow-sm">
            <Link href="/explore">
              <Search className="h-4 w-4 mr-2" />
              Find more
            </Link>
          </Button>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.$id} product={product} />
          ))}
        </div>
      ) : (
        <div className="min-h-[50vh] flex items-center justify-center rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center">
          <EmptyState
            title="Your wishlist is empty"
            description="Start exploring our unique items and save your favorites here!"
            icon={<Heart className="h-12 w-12 text-muted-foreground/30" />}
            action={
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                <Link href="/explore">Go to Explore</Link>
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
