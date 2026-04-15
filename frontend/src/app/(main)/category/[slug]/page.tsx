import { getCategoryBySlug } from "@/lib/services/category.service";
import { listProducts } from "@/lib/services/product.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { page = "0", sort = "newest" } = await searchParams;
  const currentPage = parseInt(page);
  const limit = DEFAULT_PAGE_SIZE;

  try {
    const category = await getCategoryBySlug(slug);
    const { documents: products, total } = await listProducts({
      categoryId: category.$id,
      page: currentPage,
      limit,
      sort: sort as any,
    });

    const totalPages = Math.ceil(total / limit);

    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:items-start gap-4 mb-8">
          <h1 className="font-heading text-4xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">{category.description}</p>
          )}
          <p className="text-sm font-medium text-muted-foreground">
            {total} {total === 1 ? "item" : "items"} available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar / Filters placeholder */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm space-y-6">
              <h2 className="font-bold text-lg border-b pb-2">Category Detail</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground italic">Filtering by price and attributes for categories is coming soon.</p>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {products.length > 0 ? (
              <div className="space-y-12">
                <ProductGrid products={products} columns={3} />
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            ) : (
              <div className="min-h-[40vh] flex items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/30">
                <EmptyState
                  title="No items in this category"
                  description="We haven't added any items to this category yet. Check back soon or explore other categories."
                  action={
                    <Button asChild variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all">
                      <Link href="/explore">Explore all products</Link>
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in CategoryPage:", error);
    notFound();
  }
}

