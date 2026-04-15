import { searchProducts } from "@/lib/services/product.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { Product, PaginatedResponse } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "0" } = await searchParams;
  const currentPage = parseInt(page);
  const limit = DEFAULT_PAGE_SIZE;

  let results: PaginatedResponse<Product> = { documents: [], total: 0, hasMore: false };
  if (q) {
    results = await searchProducts(q, currentPage, limit);
  }

  const totalPages = Math.ceil(results.total / limit);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {q ? `Results for "${q}"` : "Search Results"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {results.total} {results.total === 1 ? "item" : "items"} found
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm space-y-6">
            <h2 className="font-bold text-lg border-b pb-2">Filters</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">Filter functionality is coming soon.</p>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="md:col-span-3">
          {results.documents.length > 0 ? (
            <div className="space-y-12">
              <ProductGrid products={results.documents} columns={3} />
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : (
            <div className="min-h-[40vh] flex items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/30">
              <EmptyState
                title="No items found"
                description={q ? `We couldn't find anything matching "${q}". Try different keywords.` : "Enter a search term to find products in the search bar above."}
                action={
                  <Button asChild variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all">
                    <Link href="/explore">Browse all products</Link>
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

