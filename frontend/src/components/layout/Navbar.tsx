"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement search logic
  };

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-[var(--navbar-height)] max-w-[var(--max-width)] items-center px-4 sm:px-6 lg:px-8 gap-4">
        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="font-heading text-2xl font-bold tracking-tight text-[var(--etsy-orange)]">
            Marketplace
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 hidden md:flex items-center">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-2xl mx-auto flex items-center"
          >
            <Input
              type="search"
              placeholder="Search for items or shops"
              className="w-full rounded-full bg-muted/50 border-border pr-12 focus-visible:ring-[var(--etsy-orange)]"
              aria-label="Search products"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-2 ml-auto">
          {/* Become a seller link (Desktop only) */}
          <Link
            href="/seller/dashboard"
            className="hidden lg:flex text-sm font-medium hover:text-[var(--etsy-orange)] transition-colors px-4 py-2"
          >
            Sell on Marketplace
          </Link>

          <Button variant="ghost" size="icon" asChild aria-label="Sign In">
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative" aria-label="Cart">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {/* Note: In future we will wire up the actual cart count from state here */}
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--etsy-orange)] text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </Button>
        </nav>
      </div>

      {/* Mobile Search - shows below navbar on small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative w-full flex items-center">
          <Input
            type="search"
            placeholder="Search for items..."
            className="w-full rounded-full bg-muted/50 border-border pr-12 focus-visible:ring-[var(--etsy-orange)]"
            aria-label="Search products"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </header>
  );
}
