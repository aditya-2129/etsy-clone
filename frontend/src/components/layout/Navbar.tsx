"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  Loader2,
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
import { useDebounce } from "@/hooks/useDebounce";
import { searchProducts } from "@/lib/services/product.service";
import { searchShops } from "@/lib/services/shop.service";
import type { Product, Shop } from "@/lib/types";

type ProductSuggestion = Pick<Product, "$id" | "title" | "slug">;
type ShopSuggestion = Pick<Shop, "$id" | "name" | "slug">;

const MIN_SEARCH_LENGTH = 3;
const PRODUCT_SUGGESTION_LIMIT = 5;
const SHOP_SUGGESTION_LIMIT = 4;

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [productSuggestions, setProductSuggestions] = useState<
    ProductSuggestion[]
  >([]);
  const [shopSuggestions, setShopSuggestions] = useState<ShopSuggestion[]>([]);

  const debouncedQuery = useDebounce(query, 260);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!isSearchFocused || trimmed.length < MIN_SEARCH_LENGTH) return;

    let cancelled = false;

    Promise.all([
      searchProducts(trimmed, 0, PRODUCT_SUGGESTION_LIMIT),
      searchShops(trimmed, 0, SHOP_SUGGESTION_LIMIT),
    ])
      .then(([productsRaw, shopsRaw]) => {
        if (cancelled) return;

        setProductSuggestions(
          productsRaw.documents.map((product) => ({
            $id: product.$id,
            title: product.title,
            slug: product.slug,
          }))
        );
        setShopSuggestions(
          shopsRaw.documents.map((shop) => ({
            $id: shop.$id,
            name: shop.name,
            slug: shop.slug,
          }))
        );
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load search suggestions:", error);
        setProductSuggestions([]);
        setShopSuggestions([]);
        setSuggestionError("Couldn't load suggestions. Please press Enter.");
      })
      .finally(() => {
        if (!cancelled) setIsSuggesting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isSearchFocused]);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSearchFocused(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch();
  };

  const handleSearchInputChange = (value: string) => {
    setQuery(value);
    if (value.trim().length < MIN_SEARCH_LENGTH) {
      setIsSuggesting(false);
      setSuggestionError(null);
      setProductSuggestions([]);
      setShopSuggestions([]);
      return;
    }

    if (isSearchFocused) {
      setIsSuggesting(true);
      setSuggestionError(null);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (query.trim().length >= MIN_SEARCH_LENGTH) {
      setIsSuggesting(true);
      setSuggestionError(null);
    }
  };

  const handleSuggestionSelect = (href: string) => {
    setIsSearchFocused(false);
    router.push(href);
  };

  const trimmedQuery = query.trim();
  const showSuggestionDropdown =
    isSearchFocused && trimmedQuery.length >= MIN_SEARCH_LENGTH;
  const hasSuggestions =
    productSuggestions.length > 0 || shopSuggestions.length > 0;

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
          <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <Input
                name="q"
                type="search"
                value={query}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsSearchFocused(false);
                }}
                autoComplete="off"
                placeholder="Search for items or shops"
                className="w-full rounded-full bg-muted/50 border-border pr-12 focus-visible:ring-[var(--etsy-orange)]"
                aria-label="Search products and shops"
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

            {showSuggestionDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
                {isSuggesting ? (
                  <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading suggestions...
                  </div>
                ) : suggestionError ? (
                  <div className="px-4 py-4 text-sm text-muted-foreground">
                    {suggestionError}
                  </div>
                ) : hasSuggestions ? (
                  <div className="max-h-80 overflow-y-auto">
                    {productSuggestions.length > 0 && (
                      <div className="p-2">
                        <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Products
                        </p>
                        {productSuggestions.map((product) => (
                          <button
                            key={product.$id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              handleSuggestionSelect(`/product/${product.slug}`)
                            }
                            className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          >
                            {product.title}
                          </button>
                        ))}
                      </div>
                    )}

                    {shopSuggestions.length > 0 && (
                      <div className="p-2 border-t border-border">
                        <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Shops
                        </p>
                        {shopSuggestions.map((shop) => (
                          <button
                            key={shop.$id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              handleSuggestionSelect(`/shop/${shop.slug}`)
                            }
                            className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          >
                            {shop.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-sm text-muted-foreground">
                    No suggestions found.
                  </div>
                )}

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={submitSearch}
                  className="w-full border-t border-border px-4 py-3 text-left text-sm font-medium text-[var(--etsy-orange)] hover:bg-[var(--etsy-orange)]/5 transition-colors"
                >
                  See all results for{" "}
                  <span className="font-semibold">{trimmedQuery}</span>
                </button>
              </div>
            )}
          </div>
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
        <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
          <Input
            name="q"
            type="search"
            value={query}
            onChange={(e) => handleSearchInputChange(e.target.value)}
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
