import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require the user to be authenticated
const PROTECTED_ROUTES = ["/account", "/seller", "/checkout", "/admin"];

/**
 * Checks for a valid Appwrite session cookie.
 * Appwrite sets `a_session_<projectId>` or `a_session_<projectId>_legacy`.
 */
function hasValidSession(request: NextRequest): boolean {
  const cookies = request.cookies.getAll();
  return cookies.some(
    (c) =>
      c.name.startsWith("a_session_") &&
      c.value.length > 0 &&
      c.value !== "deleted"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = hasValidSession(request);

  // Block unauthenticated users from protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // NOTE: We intentionally do NOT redirect authenticated users away
  // from /login or /register. The AuthContext handles that client-side
  // to avoid stale cookie issues. This can be re-enabled once
  // auth flow is fully stable.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/seller/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};

