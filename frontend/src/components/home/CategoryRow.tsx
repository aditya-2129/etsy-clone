import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryRowProps {
  categories: Category[];
}

/**
 * Horizontally scrollable category chip row for the homepage.
 * Receives categories from the server - no client interactivity needed.
 */
export default function CategoryRow({ categories }: CategoryRowProps) {
  if (!categories.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
          Shop by Category
        </h2>
        <Link
          href="/explore"
          className="text-sm font-semibold text-[var(--etsy-orange)] hover:underline underline-offset-4 transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <Link
            key={cat.$id}
            href={`/explore?category=${cat.$id}`}
            className="group flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-foreground/85 shadow-sm hover:border-[var(--etsy-orange)]/40 hover:bg-[var(--etsy-orange)]/5 hover:text-[var(--etsy-orange)] transition-all duration-200 active:scale-95"
          >
            {/* Icon (emoji stored in DB, or fallback) */}
            {cat.icon && (
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
            )}
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
