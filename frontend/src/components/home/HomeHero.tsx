"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_LINKS = [
  { label: "Gifts", href: "/search?q=gifts" },
  { label: "Home Decor", href: "/search?q=home+decor" },
  { label: "Jewelry", href: "/search?q=jewelry" },
  { label: "Clothing", href: "/search?q=clothing" },
  { label: "Art", href: "/search?q=art" },
  { label: "Craft Supplies", href: "/search?q=craft+supplies" },
];

export default function HomeHero() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("hero-q") as string;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl min-h-[420px] md:min-h-[480px]">
      {/* Background Image */}
      <Image
        src="/images/hero-banner.webp"
        alt="Handmade artisan products"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full min-h-[420px] md:min-h-[480px] px-6 sm:px-10 md:px-16 py-12 max-w-2xl">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-wider w-fit mb-5 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--etsy-orange)] animate-pulse" />
          Handmade &middot; Vintage &middot; Unique
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4">
          Find things you&apos;ll{" "}
          <span className="text-[var(--etsy-orange)]">love.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-white/80 max-w-lg mb-8 leading-relaxed">
          Support independent creators and discover one-of-a-kind items,
          handcrafted with care.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-lg flex items-center mb-6"
        >
          <Input
            name="hero-q"
            type="search"
            placeholder="Search for anything..."
            className="w-full h-12 sm:h-14 rounded-full bg-white/95 backdrop-blur-sm border-0 text-foreground pl-5 pr-14 text-sm sm:text-base shadow-2xl placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-[var(--etsy-orange)]"
            aria-label="Search marketplace"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1.5 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            aria-label="Search"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-white/50 text-xs font-medium mr-1">
            Popular:
          </span>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/85 text-xs font-medium hover:bg-white/20 hover:text-white transition-all duration-200 hover:border-white/30"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
