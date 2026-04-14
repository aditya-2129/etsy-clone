"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { listAllProducts, deleteProduct, togglePublish } from "@/lib/services/product.service";
import { getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { 
  Loader2, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Package,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// =============================================================================
// Listings Manager Page — Allows sellers to manage their products
// =============================================================================

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    if (!user?.userId) return;
    try {
      const response = await listAllProducts({ 
        sellerId: user.userId,
        limit: 100 // Get all for now
      });
      setProducts(response.documents);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Could not load your products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.$id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleTogglePublish = async (productId: string, currentStatus: boolean) => {
    try {
      await togglePublish(productId, !currentStatus);
      setProducts(products.map(p => p.$id === productId ? { ...p, isPublished: !currentStatus } : p));
      toast.success(currentStatus ? "Product unpublished" : "Product published!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings Manager</h1>
          <p className="text-[var(--muted-foreground)]">Manage your shop inventory and visibility.</p>
        </div>
        <Button asChild className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] rounded-xl h-11">
          <Link href="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-card border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your listings..." 
            className="pl-10 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products List */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.$id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={getFilePreview(BUCKET_PRODUCT_IMAGES, product.images[0], { width: 100, height: 100 })}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground absolute inset-0 m-auto opacity-20" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm truncate max-w-[200px] md:max-w-xs">{product.title}</span>
                          <span className="text-xs text-muted-foreground truncate">slug: {product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.isPublished ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                          <div className="h-1 w-1 rounded-full bg-green-500" />
                          Published
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase">
                          <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                          Draft
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.stock < 5 ? 'text-red-500 font-medium' : ''}`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" /> View in Store
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                            <Link href={`/seller/products/${product.$id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleTogglePublish(product.$id, !!product.isPublished)}
                            className="rounded-lg cursor-pointer"
                          >
                            {product.isPublished ? (
                              <><EyeOff className="mr-2 h-4 w-4" /> Unpublish</>
                            ) : (
                              <><Eye className="mr-2 h-4 w-4" /> Publish</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.$id)}
                            className="text-destructive focus:text-destructive rounded-lg cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-muted-foreground opacity-40" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {searchQuery ? "No matching listings" : "No listings yet"}
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto mb-8">
              {searchQuery 
                ? `We couldn't find any products matching "${searchQuery}".` 
                : "You haven't added any products to your shop yet. Start selling today!"}
            </p>
            <Button asChild className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] rounded-xl">
              <Link href="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Listing
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
