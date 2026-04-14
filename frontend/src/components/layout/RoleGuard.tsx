"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";

// =============================================================================
// RoleGuard — Client-side role-based route protection
// =============================================================================

interface RoleGuardProps {
  /** The roles allowed to access the wrapped content. */
  allowedRoles: UserRole[];
  /** Content to render when the user is authorized. */
  children: React.ReactNode;
  /** Optional URL to redirect to when unauthorized. Defaults to "/" */
  fallbackUrl?: string;
}

/**
 * Wraps content that requires a specific user role.
 * - Shows a loading spinner while auth state is resolving
 * - Redirects unauthenticated users to /login
 * - Redirects unauthorized users (wrong role) to the fallback URL
 * - Renders children only when the user has a matching role
 */
export default function RoleGuard({
  allowedRoles,
  children,
  fallbackUrl = "/",
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(fallbackUrl);
    }
  }, [user, isLoading, allowedRoles, fallbackUrl, router]);

  // Loading state — centered spinner
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  // Not authenticated or wrong role — render nothing while redirect happens
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
