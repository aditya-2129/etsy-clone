"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { databases, Query } from "@/lib/appwrite";
import {
  DATABASE_ID,
  COLLECTION_ORDERS,
  DEFAULT_PAGE_SIZE,
} from "@/lib/constants";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import type { Order } from "@/lib/types";
import { OrderStatus } from "@/lib/types";

// =============================================================================
// Admin — Order Oversight Page
// =============================================================================

const STATUS_OPTIONS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Confirmed", value: OrderStatus.CONFIRMED },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-blue-500/10 text-blue-600",
  shipped: "bg-cyan-500/10 text-cyan-600",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const queries: string[] = [];

      if (statusFilter) {
        queries.push(Query.equal("status", statusFilter));
      }

      queries.push(Query.orderDesc("$createdAt"));
      queries.push(Query.limit(DEFAULT_PAGE_SIZE));
      queries.push(Query.offset(page * DEFAULT_PAGE_SIZE));

      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ORDERS,
        queries
      );

      setOrders(result.documents as unknown as Order[]);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Order Oversight
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {total} total order{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | "");
            setPage(0);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/50" />
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No orders found.
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
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Buyer
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Tracking
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {orders.map((order) => (
                  <tr
                    key={order.$id}
                    className="hover:bg-[var(--accent)]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium">
                        {order.$id.slice(0, 12)}...
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      <p className="font-mono text-xs">
                        {order.buyerId.slice(0, 10)}...
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          STATUS_STYLES[order.status] ?? "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs capitalize text-[var(--muted-foreground)]">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : order.paymentStatus === "refunded"
                                ? "bg-purple-500/10 text-purple-600"
                                : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                      {order.trackingNumber || "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {formatDate(order.$createdAt)}
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
