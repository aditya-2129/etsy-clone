import Link from "next/link";
import { ArrowRight, Sparkles, ShoppingBag, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-muted/30 px-6 py-16 md:px-12 md:py-24 text-center">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 rounded-full bg-[var(--etsy-orange)]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-64 w-64 rounded-full bg-[var(--etsy-orange)]/10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--etsy-orange)]/10 text-[var(--etsy-orange)] text-xs font-bold uppercase tracking-wider fade-in">
            <Sparkles className="h-3 w-3" />
            Discover Unique Treasures
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Find things you&apos;ll <span className="text-[var(--etsy-orange)]">love</span> and cherish.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From handmade jewelry to vintage home decor, shop one-of-a-kind items directly from independent creators around the world.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] text-white h-12 px-8 rounded-full shadow-lg shadow-[var(--etsy-orange)]/20">
              <Link href="/search">Shop Everything</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full border-2">
              <Link href="/about">How it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground">The best of our marketplace, curated for you.</p>
          </div>
          <Button variant="link" asChild className="text-[var(--etsy-orange)]">
            <Link href="/categories" className="group">
              View all <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Jewelry", icon: "💍", color: "bg-blue-50" },
            { name: "Clothing", icon: "👕", color: "bg-orange-50" },
            { name: "Home & Living", icon: "🏠", color: "bg-emerald-50" },
            { name: "Art", icon: "🎨", color: "bg-purple-50" },
            { name: "Craft Supplies", icon: "🧵", color: "bg-pink-50" },
            { name: "Gifts", icon: "🎁", color: "bg-red-50" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/search?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl border bg-card hover:border-[var(--etsy-orange)]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`h-16 w-16 ${cat.color} rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <p className="font-semibold text-center text-sm group-hover:text-[var(--etsy-orange)] transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Advantage Banner */}
      <section className="bg-[var(--etsy-orange)] rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <ShoppingBag className="h-64 w-64" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Unique Everything</h3>
            <p className="text-white/80 text-sm">Millions of one-of-a-kind items that you won&apos;t find anywhere else.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Safe & Secure</h3>
            <p className="text-white/80 text-sm">Advanced encryption and protection ensures your data is always safe.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Support Creators</h3>
            <p className="text-white/80 text-sm">Every purchase goes directly to supporting independent artisans.</p>
          </div>
        </div>
      </section>

      {/* Recent Collections Placeholder */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Handpicked for you</h2>
          <p className="text-muted-foreground">Our community is loving these right now.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group flex flex-col gap-3">
              <div className="aspect-square rounded-2xl bg-muted animate-pulse overflow-hidden relative">
                {/* Image Placeholder logic can go here later */}
              </div>
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
