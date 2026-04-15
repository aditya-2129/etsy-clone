import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/services/shop.service";
import { getProductsByShop } from "@/lib/services/product.service";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { normalize } from "@/lib/utils";

interface ShopPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Dynamic metadata for the shop page.
 */
export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const shop = await getShopBySlug(slug);
    return {
      title: `${shop.name} | Etsy Clone`,
      description: shop.description || `Browse unique products from ${shop.name} on our marketplace.`,
    };
  } catch (error) {
    return {
      title: "Shop Not Found | Etsy Clone",
    };
  }
}

/**
 * Shop Details Page Component.
 * Fetches shop info and products server-side.
 */
export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  let shopRaw;
  let productsRaw = [];

  try {
    shopRaw = await getShopBySlug(slug);
    productsRaw = await getProductsByShop(shopRaw.$id);
  } catch (error) {
    console.error("Failed to load shop page:", error);
    notFound();
  }

  // Double check if shop was found
  if (!shopRaw) {
    notFound();
  }

  // Normalize data for serialization between Server and Client components
  const shop = normalize(shopRaw);
  const products = normalize(productsRaw);

  return (
    <div className="container py-8 max-w-7xl animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/explore" className="hover:text-foreground transition-colors">Shops</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate max-w-[200px]">{shop.name}</span>
      </nav>

      {/* Hero Header Area */}
      <ShopHeader shop={shop} />

      {/* Shop Content */}
      <div className="mt-16 space-y-12">
        {/* Products Section */}
        <section id="products" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Active Listings</h2>
              <p className="text-sm text-muted-foreground">
                Showing {products.length} unique items handcrafted by {shop.name}
              </p>
            </div>
            
            {/* Filters placeholder */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-48 rounded-full border bg-card flex items-center px-4 text-xs font-medium text-muted-foreground cursor-not-allowed">
                Sort by: Featured
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} columns={4} />
          ) : (
            <div className="py-24 text-center space-y-4 rounded-3xl border-2 border-dashed border-border/50 bg-muted/20">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-inner">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">No products yet</h3>
                <p className="text-sm text-muted-foreground mx-auto max-w-xs">
                  This shop hasn't listed any items for sale yet. Check back soon for unique finds!
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Shop Policies/About (Optional) */}
        {shop.policies && (
           <section id="policies" className="pt-12 border-t border-border/40">
             <div className="grid md:grid-cols-3 gap-12">
               <div>
                 <h2 className="text-xl font-bold mb-4">Shop Policies</h2>
                 <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Updated {new Date(shop.$updatedAt).toLocaleDateString()}</p>
               </div>
               <div className="md:col-span-2 prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                 {shop.policies}
               </div>
             </div>
           </section>
        )}
      </div>
    </div>
  );
}

