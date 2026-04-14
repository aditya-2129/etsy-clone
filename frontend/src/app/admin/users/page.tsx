"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  Shield,
  ShieldOff,
  UserCog,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  listUsers,
  suspendUser,
  unsuspendUser,
  changeUserRole,
} from "@/lib/services/user.service";
import { formatDate } from "@/lib/utils/formatters";
import type { User, UserFilters } from "@/lib/types";
import { UserRole } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// =============================================================================
// Admin — User Management Page
// =============================================================================

const ROLE_OPTIONS: { label: string; value: UserRole | "" }[] = [
  { label: "All Roles", value: "" },
  { label: "Buyer", value: UserRole.BUYER },
  { label: "Seller", value: UserRole.SELLER },
  { label: "Admin", value: UserRole.ADMIN },
];

const ROLE_BADGE_STYLES: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600",
  seller: "bg-emerald-500/10 text-emerald-600",
  buyer: "bg-blue-500/10 text-blue-600",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [suspendedFilter, setSuspendedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: UserFilters = { page, limit: DEFAULT_PAGE_SIZE };
      if (roleFilter) filters.role = roleFilter;
      if (suspendedFilter !== undefined)
        filters.isSuspended = suspendedFilter;

      const result = await listUsers(filters);
      setUsers(result.documents);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [page, roleFilter, suspendedFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSuspendToggle = async (user: User) => {
    setActionLoading(user.$id);
    try {
      if (user.isSuspended) {
        await unsuspendUser(user.$id);
        toast.success(`${user.name} has been unsuspended.`);
      } else {
        await suspendUser(user.$id);
        toast.success(`${user.name} has been suspended.`);
      }
      await fetchUsers();
    } catch {
      toast.error("Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (user: User, newRole: UserRole) => {
    if (user.role === newRole) return;

    setActionLoading(user.$id);
    try {
      await changeUserRole(user.$id, newRole);
      toast.success(`${user.name} is now a ${newRole}.`);
      await fetchUsers();
    } catch {
      toast.error("Failed to change user role.");
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
          User Management
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {total} total user{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as UserRole | "");
            setPage(0);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={suspendedFilter === undefined ? "" : String(suspendedFilter)}
          onChange={(e) => {
            const val = e.target.value;
            setSuspendedFilter(val === "" ? undefined : val === "true");
            setPage(0);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Suspended</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/50" />
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No users found matching your filters.
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
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {users.map((user) => (
                  <tr
                    key={user.$id}
                    className="hover:bg-[var(--accent)]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user, e.target.value as UserRole)
                        }
                        disabled={actionLoading === user.$id}
                        className="rounded-md border border-[var(--border)] bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--etsy-orange)]/50"
                      >
                        <option value={UserRole.BUYER}>Buyer</option>
                        <option value={UserRole.SELLER}>Seller</option>
                        <option value={UserRole.ADMIN}>Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isSuspended
                            ? "bg-red-500/10 text-red-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {formatDate(user.$createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleSuspendToggle(user)}
                        disabled={actionLoading === user.$id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          user.isSuspended
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        } disabled:opacity-50`}
                        title={
                          user.isSuspended ? "Unsuspend user" : "Suspend user"
                        }
                      >
                        {actionLoading === user.$id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : user.isSuspended ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <ShieldOff className="h-3 w-3" />
                        )}
                        {user.isSuspended ? "Unsuspend" : "Suspend"}
                      </button>
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
