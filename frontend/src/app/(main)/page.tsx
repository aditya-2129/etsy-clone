import { ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import HomeHero from "@/components/home/HomeHero";
import CategoryRow from "@/components/home/CategoryRow";
import SectionHeading from "@/components/home/SectionHeading";
import SellerCTA from "@/components/home/SellerCTA";
import { ProductGrid } from "@/components/product/ProductGrid";
import { listCategories } from "@/lib/services/category.service";
import {
  listFeaturedProducts,
  listProducts,
} from "@/lib/services/product.service";
import { normalize } from "@/lib/utils";

function EmptyProducts({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/25 px-6 py-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default async function HomePage() {
  const [categoriesRaw, featuredRaw, trendingRaw, newestRaw] = await Promise.all(
    [
      listCategories(),
      listFeaturedProducts(8),
      listProducts({ sort: "popular", limit: 8 }),
      listProducts({ sort: "newest", limit: 8 }),
    ]
  );

  const categories = normalize(categoriesRaw);
  const featured = normalize(featuredRaw);
  const trending = normalize(trendingRaw.documents);
  const newest = normalize(newestRaw.documents);

  const featuredProducts = featured.length ? featured : trending;
  const featuredIsFallback = featured.length === 0;

  return (
    <div className="space-y-16 pb-10">
      <HomeHero />

      <div className="slide-in-left">
        <CategoryRow categories={categories} />
      </div>

      <section>
        <SectionHeading
          title={featuredIsFallback ? "Trending Picks" : "Editors' Picks"}
          subtitle={
            featuredIsFallback
              ? "Featured items are being refreshed. Here is what shoppers love most right now."
              : "A curated collection of standout products from independent creators."
          }
          viewAllHref="/explore?sort=popular"
          viewAllLabel="Browse popular"
        />
        {featuredProducts.length ? (
          <div className="stagger-in">
            <ProductGrid products={featuredProducts} />
          </div>
        ) : (
          <EmptyProducts message="No featured products yet. Check back soon for handpicked finds." />
        )}
      </section>

      <section className="rounded-3xl border bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-6 py-10 md:px-10 md:py-12">
        <SectionHeading
          title="What Makes Us Special"
          subtitle="A marketplace built around creativity, trust, and independent sellers."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-white/75 p-5 shadow-sm border border-orange-100">
            <Sparkles className="h-5 w-5 text-[var(--etsy-orange)]" />
            <h3 className="mt-3 text-base font-semibold">Unique Items</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover one-of-a-kind products you will not find in big-box
              stores.
            </p>
          </article>
          <article className="rounded-2xl bg-white/75 p-5 shadow-sm border border-orange-100">
            <ShieldCheck className="h-5 w-5 text-[var(--etsy-orange)]" />
            <h3 className="mt-3 text-base font-semibold">Secure Shopping</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Shop confidently with trusted checkout flows and reliable order
              support.
            </p>
          </article>
          <article className="rounded-2xl bg-white/75 p-5 shadow-sm border border-orange-100">
            <HeartHandshake className="h-5 w-5 text-[var(--etsy-orange)]" />
            <h3 className="mt-3 text-base font-semibold">Support Creators</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every order directly supports independent makers and small
              businesses.
            </p>
          </article>
        </div>
      </section>

      <section>
        <SectionHeading
          title="Popular on Marketplace"
          subtitle="Best-selling products based on community demand."
          viewAllHref="/explore?sort=popular"
          viewAllLabel="View trending"
        />
        {trending.length ? (
          <div className="stagger-in">
            <ProductGrid products={trending} />
          </div>
        ) : (
          <EmptyProducts message="No trending products available yet." />
        )}
      </section>

      <SellerCTA />

      <section>
        <SectionHeading
          title="Fresh Finds"
          subtitle="Recently added products from shops across the marketplace."
          viewAllHref="/explore?sort=newest"
          viewAllLabel="See new arrivals"
        />
        {newest.length ? (
          <div className="stagger-in">
            <ProductGrid products={newest} />
          </div>
        ) : (
          <EmptyProducts message="No newly added products available yet." />
        )}
      </section>
    </div>
  );
}
