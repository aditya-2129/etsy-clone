"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  listAllShops,
  listPendingShops,
  approveShop,
  rejectShop,
  toggleShopActive,
} from "@/lib/services/shop.service";
import { formatDate } from "@/lib/utils/formatters";
import type { Shop, ShopFilters } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import Link from "next/link";

// =============================================================================
// Admin — Shop Management Page
// =============================================================================

type TabKey = "pending" | "all";

export default function AdminShopsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [shops, setShops] = useState<Shop[]>([]);
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listPendingShops();
      setPendingShops(result);
    } catch {
      toast.error("Failed to load pending shops.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: ShopFilters = { page, limit: DEFAULT_PAGE_SIZE };
      const result = await listAllShops(filters);
      setShops(result.documents);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load shops.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingShops();
    } else {
      fetchAllShops();
    }
  }, [activeTab, fetchPendingShops, fetchAllShops]);

  const handleApprove = async (shop: Shop) => {
    setActionLoading(shop.$id);
    try {
      await approveShop(shop.$id);
      toast.success(`"${shop.name}" has been approved!`);
      if (activeTab === "pending") {
        await fetchPendingShops();
      } else {
        await fetchAllShops();
      }
    } catch {
      toast.error("Failed to approve shop.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (shop: Shop) => {
    setActionLoading(shop.$id);
    try {
      await rejectShop(shop.$id);
      toast.success(`"${shop.name}" has been rejected.`);
      if (activeTab === "pending") {
        await fetchPendingShops();
      } else {
        await fetchAllShops();
      }
    } catch {
      toast.error("Failed to reject shop.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (shop: Shop) => {
    setActionLoading(shop.$id);
    try {
      await toggleShopActive(shop.$id, !shop.isActive);
      toast.success(
        `"${shop.name}" is now ${!shop.isActive ? "active" : "inactive"}.`
      );
      await fetchAllShops();
    } catch {
      toast.error("Failed to update shop status.");
    } finally {
      setActionLoading(null);
    }
  };

  const displayedShops = activeTab === "pending" ? pendingShops : shops;
  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Shop Management
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Approve, reject, and manage marketplace shops.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-[var(--accent)]/50 p-1 w-fit">
        {(["pending", "all"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(0);
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab === "pending"
              ? `Pending Approval${pendingShops.length > 0 ? ` (${pendingShops.length})` : ""}`
              : "All Shops"}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
        </div>
      ) : displayedShops.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/50" />
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              {activeTab === "pending"
                ? "No shops pending approval. 🎉"
                : "No shops found."}
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
                    Shop
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {displayedShops.map((shop) => (
                  <tr
                    key={shop.$id}
                    className="hover:bg-[var(--accent)]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-[var(--muted-foreground)]">
                              /{shop.slug}
                            </p>
                            <Link
                              href={`/shop/${shop.slug}`}
                              target="_blank"
                              className="text-[var(--muted-foreground)] hover:text-[var(--etsy-orange)] transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            shop.isApproved
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {shop.isApproved ? "Approved" : "Pending"}
                        </span>
                        <span
                          className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            shop.isActive
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {shop.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      ⭐ {shop.rating.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {formatDate(shop.$createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!shop.isApproved && (
                          <button
                            onClick={() => handleApprove(shop)}
                            disabled={actionLoading === shop.$id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === shop.$id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            Approve
                          </button>
                        )}
                        {shop.isApproved && (
                          <button
                            onClick={() => handleReject(shop)}
                            disabled={actionLoading === shop.$id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === shop.$id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            Revoke
                          </button>
                        )}
                        {activeTab === "all" && (
                          <button
                            onClick={() => handleToggleActive(shop)}
                            disabled={actionLoading === shop.$id}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50 transition-colors ${
                              shop.isActive
                                ? "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
                                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                            }`}
                          >
                            {shop.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (all tab only) */}
      {activeTab === "all" && totalPages > 1 && (
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
