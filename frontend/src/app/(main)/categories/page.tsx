import Link from "next/link";
import { listCategories } from "@/lib/services/category.service";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Shop by Category</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of unique and creative categories.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat: Category) => (
          <Link 
            key={cat.$id} 
            href={`/category/${cat.slug}`}
            className="group flex flex-col gap-4 p-8 rounded-3xl border border-border/50 bg-card hover:border-[var(--etsy-orange)]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-20 w-20 mx-auto rounded-full bg-[var(--etsy-orange)]/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              {/* Fallback icon or character if no icon field exists */}
              {cat.slug.charAt(0).toUpperCase()}
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg group-hover:text-[var(--etsy-orange)] transition-colors">{cat.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
