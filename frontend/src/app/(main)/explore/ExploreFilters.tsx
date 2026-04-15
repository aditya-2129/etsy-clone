"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function parseNumber(value: string | null) {
  if (!value) return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "";
}

export function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [onSaleOnly, setOnSaleOnly] = React.useState(false);

  React.useEffect(() => {
    setMinPrice(parseNumber(searchParams.get("minPrice")));
    setMaxPrice(parseNumber(searchParams.get("maxPrice")));
    setInStockOnly(searchParams.get("inStock") === "true");
    setOnSaleOnly(searchParams.get("onSale") === "true");
  }, [searchParams]);

  const activeCount = [
    Boolean(searchParams.get("minPrice")),
    Boolean(searchParams.get("maxPrice")),
    searchParams.get("inStock") === "true",
    searchParams.get("onSale") === "true",
  ].filter(Boolean).length;

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedMin = minPrice.trim();
    const normalizedMax = maxPrice.trim();

    if (normalizedMin) {
      params.set("minPrice", normalizedMin);
    } else {
      params.delete("minPrice");
    }

    if (normalizedMax) {
      params.set("maxPrice", normalizedMax);
    } else {
      params.delete("maxPrice");
    }

    if (inStockOnly) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }

    if (onSaleOnly) {
      params.set("onSale", "true");
    } else {
      params.delete("onSale");
    }

    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `/explore?${query}` : "/explore");
      setOpen(false);
    });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("inStock");
    params.delete("onSale");
    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `/explore?${query}` : "/explore");
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-bold text-sm transition-all active:scale-95 shadow-sm hover:bg-muted">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--etsy-orange)] px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-md border-l border-black/10 bg-[linear-gradient(180deg,#fffdf9,#f8f4ed)] p-0"
      >
        <SheetHeader className="border-b border-black/8 px-6 py-5">
          <div className="flex items-center gap-2 text-[var(--etsy-orange)]">
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Refine results</span>
          </div>
          <SheetTitle className="mt-2 text-2xl font-bold">Filter products</SheetTitle>
          <SheetDescription>
            Narrow the explore page by price, availability, and discount status.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          <section className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Price range</p>
              <p className="mt-1 text-sm text-muted-foreground">Show items within your budget.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="min-price">Min price</Label>
                <Input
                  id="min-price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-11 rounded-xl bg-white/80 px-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-price">Max price</Label>
                <Input
                  id="max-price"
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-11 rounded-xl bg-white/80 px-3"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Availability</p>
              <p className="mt-1 text-sm text-muted-foreground">Hide items that customers cannot buy right now.</p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/8 bg-white/70 p-4 transition-colors hover:bg-white">
              <Checkbox
                checked={inStockOnly}
                onCheckedChange={(checked) => setInStockOnly(checked === true)}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold">In stock only</p>
                <p className="mt-1 text-sm text-muted-foreground">Only show products that still have inventory left.</p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/8 bg-white/70 p-4 transition-colors hover:bg-white">
              <Checkbox
                checked={onSaleOnly}
                onCheckedChange={(checked) => setOnSaleOnly(checked === true)}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold">On sale only</p>
                <p className="mt-1 text-sm text-muted-foreground">Only show listings with a compare-at discount.</p>
              </div>
            </label>
          </section>
        </div>

        <SheetFooter className="border-t border-black/8 bg-white/60 px-6 py-5">
          <Button
            variant="outline"
            className="h-11 rounded-full"
            onClick={resetFilters}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            className="h-11 rounded-full bg-[var(--etsy-orange)] text-white hover:bg-[var(--etsy-orange-hover)]"
            onClick={applyFilters}
            disabled={isPending}
          >
            {isPending ? "Applying..." : "Apply filters"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
