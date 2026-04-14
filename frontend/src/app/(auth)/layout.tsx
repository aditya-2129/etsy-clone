import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Handmade Marketplace",
  description: "Sign in or create an account to start shopping handmade goods.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal top bar — just the logo */}
      <header className="w-full border-b border-border/50 bg-background">
        <div className="mx-auto flex h-16 max-w-md items-center justify-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-[var(--etsy-orange)]">
              Marketplace
            </span>
          </Link>
        </div>
      </header>

      {/* Centered content area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md fade-in">
          {children}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="w-full border-t border-border/50 bg-background">
        <div className="mx-auto flex h-12 max-w-md items-center justify-center gap-4 px-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Marketplace</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/help" className="hover:underline">Help</Link>
        </div>
      </footer>
    </div>
  );
}
