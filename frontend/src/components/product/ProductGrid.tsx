import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

  return (
    <div className={`grid ${gridCols} gap-4 md:gap-5 xl:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.$id} product={product} />
      ))}
    </div>
  );
}
