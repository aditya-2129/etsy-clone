"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getShopsBySellerId, createShop } from "@/lib/services/shop.service";
import { upgradeToSeller, linkShopToUser } from "@/lib/services/user.service";
import { listAllProducts } from "@/lib/services/product.service";
import type { Shop } from "@/lib/types";
import { Loader2, Store, Package, ShoppingBag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// =============================================================================
// Seller Dashboard Page — Handles Onboarding & Metrics
// =============================================================================

export default function SellerDashboardPage() {
  const { user, refreshUser } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for new shop
  const [shopName, setShopName] = useState("");
  const [shopSlug, setShopSlug] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.userId) return;
      try {
        const shops = await getShopsBySellerId(user.userId);
        if (shops.length > 0) {
          setShop(shops[0]);
          
          // Also fetch product count
          const products = await listAllProducts({ sellerId: user.userId });
          setProductCount(products.total);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Refresh user state to ensure session is valid and fresh
    await refreshUser();
    
    if (!user?.userId || !user?.$id) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    if (!shopName.trim() || !shopSlug.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    try {
      // 1. Create the shop using the Auth ID for sellerId (required for permissions)
      const newShop = await createShop({
        name: shopName.trim(),
        slug: shopSlug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        sellerId: user.userId,
        description: "",
        rating: 0,
        totalSales: 0,
        isActive: true,
        isApproved: false,
      });

      // 2. Upgrade user role if they are still a buyer
      if (user.role === "buyer") {
        await upgradeToSeller(user.$id);
      }

      // 3. Link the shop to the user document so user.shopId is set
      await linkShopToUser(user.$id, newShop.$id);

      // 4. Refresh AuthContext so the updated shopId is available app-wide
      await refreshUser();

      setShop(newShop);
      toast.success("Shop created! Welcome to the marketplace.");
    } catch (error) {
      console.error("Creation failed:", error);
      toast.error("Failed to create shop. This slug might be taken.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  // ONBOARDING VIEW: No shop found
  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-[var(--etsy-orange)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Store className="h-8 w-8 text-[var(--etsy-orange)]" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Open your shop today</h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          Join thousands of independent creators and start selling your handmade goods to a global audience.
        </p>

        <form onSubmit={handleCreateShop} className="bg-card border rounded-2xl p-8 text-left shadow-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--etsy-orange)]" />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-sm font-semibold">Shop Name</Label>
              <Input
                id="shopName"
                placeholder="The Creative Corner"
                className="h-11 rounded-xl"
                value={shopName}
                onChange={(e) => {
                  setShopName(e.target.value);
                  if (!shopSlug) {
                    setShopSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }
                }}
                required
              />
              <p className="text-xs text-muted-foreground">Pick a name that reflects your unique style and products.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopSlug" className="text-sm font-semibold">Shop URL Slug</Label>
              <div className="flex items-center group">
                <div className="h-11 px-3 flex items-center bg-muted border border-r-0 rounded-l-xl text-xs font-mono text-muted-foreground whitespace-nowrap group-focus-within:border-[var(--etsy-orange)] group-focus-within:ring-1 group-focus-within:ring-[var(--etsy-orange)]/50 transition-all">
                  marketplace.com/shop/
                </div>
                <Input
                  id="shopSlug"
                  className="h-11 rounded-l-none rounded-r-xl border-l-0 focus-visible:ring-offset-0"
                  placeholder="creative-corner"
                  value={shopSlug}
                  onChange={(e) => setShopSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">This is your permanent shop address. Lowercase, numbers, and hyphens only.</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-8 h-12 text-base font-semibold rounded-xl bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] shadow-md transition-all active:scale-[0.98]"
            disabled={isCreating}
          >
            {isCreating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Open Your Shop
          </Button>
        </form>
      </div>
    );
  }

  // DASHBOARD VIEW: Shop exists
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[var(--muted-foreground)]">Manage your shop: {shop.name}</p>
        </div>
      </div>

      {!shop.isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">Shop Under Review</h3>
            <p className="text-sm text-amber-800">
              Your shop has been created and is now being reviewed by our team. Your products will be hidden from the public marketplace until your shop is approved.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm font-medium">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold">₹0.00</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">Orders</span>
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
            <Store className="h-4 w-4" />
            <span className="text-sm font-medium">Products</span>
          </div>
          <p className="text-2xl font-bold">{productCount}</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Rating</span>
          </div>
          <p className="text-2xl font-bold">{shop.rating.toFixed(1)} / 5</p>
        </div>
      </div>

      {/* Placeholder Charts/Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
          {productCount > 0 ? (
            <>
              <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground italic">You have {productCount} active listing{productCount === 1 ? '' : 's'}.<br />Start selling to see revenue charts here!</p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="/seller/products">View My Products</a>
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground italic">No listings yet. Start by adding your first product!</p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="/seller/products/new">Add First Product</a>
              </Button>
            </>
          )}
        </div>
        <div className="bg-card border rounded-xl p-6 min-h-[300px]">
          <h3 className="font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            <div className="text-sm py-2 border-b font-medium text-[var(--etsy-orange)]">Shop Live! 🎉</div>
            <div className="text-sm py-2 border-b">Welcome to the Marketplace! Your shop is ready for business.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
