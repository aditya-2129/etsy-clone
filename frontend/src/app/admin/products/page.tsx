"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  Star,
  StarOff,
  EyeOff,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  listAllProducts,
  toggleFeatured,
  togglePublish,
} from "@/lib/services/product.service";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import type { Product, ProductFilters } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import Link from "next/link";

// =============================================================================
// Admin — Product Management Page
// =============================================================================

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(
    undefined
  );

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: ProductFilters = { page, limit: DEFAULT_PAGE_SIZE };
      if (publishedFilter !== undefined) filters.isPublished = publishedFilter;
      if (featuredFilter !== undefined) filters.isFeatured = featuredFilter;

      const result = await listAllProducts(filters);
      setProducts(result.documents);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [page, publishedFilter, featuredFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleFeatured = async (product: Product) => {
    setActionLoading(product.$id);
    try {
      await toggleFeatured(product.$id, !product.isFeatured);
      toast.success(
        `"${product.title}" ${!product.isFeatured ? "featured" : "unfeatured"}.`
      );
      await fetchProducts();
    } catch {
      toast.error("Failed to update featured status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePublish = async (product: Product) => {
    setActionLoading(product.$id);
    try {
      await togglePublish(product.$id, !product.isPublished);
      toast.success(
        `"${product.title}" ${!product.isPublished ? "published" : "unpublished"}.`
      );
      await fetchProducts();
    } catch {
      toast.error("Failed to update publish status.");
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Product Management
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {total} total product{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={publishedFilter === undefined ? "" : String(publishedFilter)}
          onChange={(e) => {
            const val = e.target.value;
            setPublishedFilter(val === "" ? undefined : val === "true");
            setPage(0);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
        >
          <option value="">All Visibility</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>

        <select
          value={featuredFilter === undefined ? "" : String(featuredFilter)}
          onChange={(e) => {
            const val = e.target.value;
            setFeaturedFilter(val === "" ? undefined : val === "true");
            setPage(0);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
        >
          <option value="">All Products</option>
          <option value="true">Featured Only</option>
          <option value="false">Not Featured</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/50" />
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No products found matching your filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--accent)]/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Sales
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {products.map((product) => (
                  <tr
                    key={product.$id}
                    className="hover:bg-[var(--accent)]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium max-w-[250px]">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-[var(--muted-foreground)]">
                              /{product.slug}
                            </p>
                            <Link
                              href={`/product/${product.slug}`}
                              target="_blank"
                              className="text-[var(--muted-foreground)] hover:text-[var(--etsy-orange)] transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`${
                          product.stock === 0
                            ? "text-red-500 font-medium"
                            : product.stock < 5
                              ? "text-amber-500"
                              : "text-[var(--muted-foreground)]"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.isPublished
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {product.isPublished ? "Published" : "Draft"}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-block w-fit rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {product.totalSold} sold
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          disabled={actionLoading === product.$id}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50 transition-colors ${
                            product.isFeatured
                              ? "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
                              : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          }`}
                          title={
                            product.isFeatured ? "Remove from featured" : "Add to featured"
                          }
                        >
                          {actionLoading === product.$id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : product.isFeatured ? (
                            <StarOff className="h-3 w-3" />
                          ) : (
                            <Star className="h-3 w-3" />
                          )}
                          {product.isFeatured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          onClick={() => handleTogglePublish(product)}
                          disabled={actionLoading === product.$id}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50 transition-colors ${
                            product.isPublished
                              ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          }`}
                        >
                          {product.isPublished ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          {product.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-[var(--muted-foreground)]">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--accent)] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--accent)] disabled:opacity-50 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
