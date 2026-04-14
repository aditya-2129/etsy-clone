"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { getDashboardStats, getRecentOrders, getRecentUsers } from "@/lib/services/admin.service";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import type { DashboardStats, Order, User } from "@/lib/types";

// =============================================================================
// Admin Dashboard Page
// =============================================================================

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [dashStats, orders, users] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(5),
          getRecentUsers(5),
        ]);
        setStats(dashStats);
        setRecentOrders(orders);
        setRecentUsers(users);
      } catch {
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Sellers",
      value: stats?.totalSellers ?? 0,
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Total Shops",
      value: stats?.totalShops ?? 0,
      icon: Store,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Revenue",
      value: formatPrice(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pending Shops",
      value: stats?.pendingShops ?? 0,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Avg. Order",
      value:
        stats && stats.totalOrders > 0
          ? formatPrice(stats.totalRevenue / stats.totalOrders)
          : "₹0",
      icon: TrendingUp,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Overview of your marketplace at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                  {card.label}
                </p>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-base font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)]">
                No orders yet.
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.$id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {order.$id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(order.$createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : order.status === "cancelled"
                            ? "bg-red-500/10 text-red-600"
                            : order.status === "shipped"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-base font-semibold">Recent Registrations</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)]">
                No users yet.
              </p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.$id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-500/10 text-purple-600"
                        : user.role === "seller"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
