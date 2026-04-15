import Link from "next/link";
import { searchProducts } from "@/lib/services/product.service";
import { searchShops } from "@/lib/services/shop.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopCard } from "@/components/shop/ShopCard";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { normalize } from "@/lib/utils";
import type { Product, Shop, PaginatedResponse } from "@/lib/types";

const MIN_SEARCH_LENGTH = 3;
const SHOP_SECTION_LIMIT = 6;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "0" } = await searchParams;
  const query = q.trim();
  const currentPage = Number.isNaN(parseInt(page, 10)) ? 0 : parseInt(page, 10);
  const productLimit = DEFAULT_PAGE_SIZE;
  const canSearch = query.length >= MIN_SEARCH_LENGTH;

  let productResults: PaginatedResponse<Product> = {
    documents: [],
    total: 0,
    hasMore: false,
  };
  let shopResults: PaginatedResponse<Shop> = {
    documents: [],
    total: 0,
    hasMore: false,
  };

  if (canSearch) {
    const [productsRaw, shopsRaw] = await Promise.all([
      searchProducts(query, currentPage, productLimit),
      searchShops(query, 0, SHOP_SECTION_LIMIT),
    ]);
    productResults = normalize(productsRaw);
    shopResults = normalize(shopsRaw);
  }

  const totalPages = Math.ceil(productResults.total / productLimit);
  const hasAnyResults =
    productResults.documents.length > 0 || shopResults.documents.length > 0;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">
          {query ? `Results for "${query}"` : "Search Marketplace"}
        </h1>
        {!query && (
          <p className="text-muted-foreground">
            Search for products and shops from independent creators.
          </p>
        )}
        {query && !canSearch && (
          <p className="text-sm text-muted-foreground">
            Enter at least {MIN_SEARCH_LENGTH} characters to search.
          </p>
        )}
        {canSearch && (
          <p className="text-muted-foreground">
            {productResults.total}{" "}
            {productResults.total === 1 ? "product" : "products"} and{" "}
            {shopResults.total} {shopResults.total === 1 ? "shop" : "shops"}{" "}
            found.
          </p>
        )}
      </header>

      {!query && (
        <div className="min-h-[30vh] flex items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/30">
          <EmptyState
            title="Start your search"
            description="Type a product or shop name in the search bar above."
            action={
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/explore">Browse all products</Link>
              </Button>
            }
          />
        </div>
      )}

      {query && !canSearch && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          Search terms shorter than {MIN_SEARCH_LENGTH} characters are not
          supported by Appwrite full-text search.
        </div>
      )}

      {canSearch && hasAnyResults && (
        <div className="space-y-12">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Matching Shops</h2>
                <p className="text-sm text-muted-foreground">
                  Top shop matches for <span className="font-medium">{query}</span>.
                </p>
              </div>
            </div>
            {shopResults.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {shopResults.documents.map((shop) => (
                  <ShopCard key={shop.$id} shop={shop} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No shops matched your search.
              </p>
            )}
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Matching Products</h2>
              <p className="text-sm text-muted-foreground">
                Product results are sorted by Appwrite full-text relevance.
              </p>
            </div>

            {productResults.documents.length > 0 ? (
              <div className="space-y-10">
                <ProductGrid products={productResults.documents} columns={3} />
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No products matched your search.
              </p>
            )}
          </section>
        </div>
      )}

      {canSearch && !hasAnyResults && (
        <div className="min-h-[40vh] flex items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/30">
          <EmptyState
            title="No matches found"
            description={`We couldn't find products or shops matching "${query}". Try different keywords.`}
            action={
              <Button
                asChild
                variant="outline"
                className="rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Link href="/explore">Browse all products</Link>
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
