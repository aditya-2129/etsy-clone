import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require the user to be authenticated
const PROTECTED_ROUTES = ["/account", "/seller", "/checkout"];

// Routes that should redirect TO the homepage if already logged in
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Appwrite session cookie
  // Appwrite sets a cookie named `a_session_<projectId>` on login
  const sessionCookie = request.cookies
    .getAll()
    .find((c) => c.name.startsWith("a_session_"));

  const isAuthenticated = !!sessionCookie;

  // Block unauthenticated users from protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/seller/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
