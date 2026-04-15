"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  LogOut,
  Package,
  Heart,
  Settings,
  Store,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-[var(--navbar-height)] max-w-[var(--max-width)] items-center px-4 sm:px-6 lg:px-8 gap-4">
        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-6 mr-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-[var(--etsy-orange)]">
              Marketplace
            </span>
          </Link>
          <Link 
            href="/explore" 
            className="hidden md:flex items-center gap-1 text-sm font-bold text-foreground/80 hover:text-[var(--etsy-orange)] transition-colors"
          >
            Explore
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 hidden md:flex items-center">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-2xl mx-auto flex items-center"
          >
            <Input
              name="q"
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
          {/* Admin Panel (Desktop only) */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors px-4 py-2"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          )}

          {/* User Icon / Dropdown */}
          {isLoading ? (
            <div className="h-9 w-9 rounded-full skeleton" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                  aria-label="Account menu"
                >
                  <div className="h-8 w-8 rounded-full bg-[var(--etsy-orange)] flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/wishlist">
                    <Heart className="mr-2 h-4 w-4" /> Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                {user.role === "buyer" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/seller/dashboard">
                      <Store className="mr-2 h-4 w-4" /> Sell on Marketplace
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Shop Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/products">
                        <Package className="mr-2 h-4 w-4" /> My Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/shop/settings">
                        <Store className="mr-2 h-4 w-4" /> Shop Settings
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="text-purple-600 font-medium">
                        <Shield className="mr-2 h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[var(--etsy-error)] cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild aria-label="Sign In">
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative" aria-label="Cart">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--etsy-orange)] text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative w-full flex items-center">
          <Input
            name="q"
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
