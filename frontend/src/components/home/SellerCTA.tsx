import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Full-width CTA banner encouraging users to open a shop.
 * Warm gradient background with overlaid text and action button.
 */
export default function SellerCTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-orange-900 to-orange-800">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 h-72 w-72 rounded-full bg-[var(--etsy-orange)]/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 translate-y-1/2 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 opacity-[0.04]">
        <Store className="h-64 w-64" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-12 md:px-16 md:py-16">
        <div className="space-y-4 text-center md:text-left max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/10">
            <Store className="h-3.5 w-3.5" />
            Become a Seller
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            Turn your passion into a{" "}
            <span className="text-amber-300">thriving business.</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
            Join thousands of independent creators. Set up your shop in minutes,
            reach millions of buyers, and start selling what you love - with
            zero listing fees to get started.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 shrink-0">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-full bg-white text-orange-900 font-bold text-base shadow-2xl hover:bg-amber-50 hover:shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/seller/dashboard" className="group">
              Open Your Shop
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <span className="text-white/40 text-xs font-medium">
            Free to start &middot; No monthly fees
          </span>
        </div>
      </div>
    </section>
  );
}
