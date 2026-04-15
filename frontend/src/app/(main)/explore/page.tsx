import { listProducts } from "@/lib/services/product.service";
import { listCategories } from "@/lib/services/category.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Suspense } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalize } from "@/lib/utils";
import { SortSelect } from "./SortSelect";
import { Pagination } from "@/components/shared/Pagination";
import type { ProductFilters } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface ExplorePageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { category, sort, minPrice, maxPrice, page } = await searchParams;

  const filters: ProductFilters = {
    categoryId: category,
    sort: (sort as ProductFilters["sort"]) || "newest",
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    page: page ? parseInt(page) : 0,
    isPublished: true,
  };

  const [productsDataRaw, categories] = await Promise.all([
    listProducts(filters),
    listCategories(),
  ]);

  const productsData = normalize(productsDataRaw);
  const currentPage = page ? parseInt(page) : 0;
  const totalPages = Math.ceil(productsData.total / DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Breadcrumbs & Title */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Explore</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              Explore All Products
            </h1>
            <p className="text-muted-foreground font-medium">
              Discover unique items from sellers around the world
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-muted font-bold text-sm transition-all active:scale-95 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="h-10 w-px bg-border hidden md:block" />
            <SortSelect defaultValue={sort || "newest"} />
          </div>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <Link
          href="/explore"
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all border shadow-sm ${
            !category 
              ? "bg-foreground text-background border-foreground" 
              : "bg-background text-foreground border-border hover:border-foreground"
          }`}
        >
          All Items
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.$id}
            href={`/explore?category=${cat.$id}`}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all border shadow-sm ${
              category === cat.$id 
                ? "bg-foreground text-background border-foreground" 
                : "bg-background text-foreground border-border hover:border-foreground"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      {productsData.documents.length > 0 ? (
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>}>
          <ProductGrid products={productsData.documents} />
        </Suspense>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border gap-4">
          <div className="p-4 rounded-full bg-background shadow-sm border border-border">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold">No items found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
          <Link 
            href="/explore" 
            className="mt-2 text-sm font-bold text-[var(--etsy-orange)] hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />
    </div>
  );
}
