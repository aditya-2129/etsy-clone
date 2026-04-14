"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  FolderTree,
  LogOut,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// AdminShell — Sidebar layout for admin panel
// =============================================================================

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/shops", label: "Shops", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]">
        {/* Brand */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-4">
          <Shield className="h-6 w-6 text-[var(--etsy-orange)]" />
          <span className="text-lg font-semibold tracking-tight font-[family-name:var(--font-heading)]">
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-[var(--etsy-orange)]/10 text-[var(--etsy-orange)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-3 py-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            Back to Marketplace
          </Link>

          {/* User info */}
          <div className="flex items-center justify-between rounded-lg bg-[var(--accent)]/50 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">
                {user?.name}
              </p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="ml-2 rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
