import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="py-8 space-y-8 fade-in">
      {/* Title skeleton */}
      <div className="h-8 w-64 rounded skeleton" />

      {/* Product grid skeleton */}
      <ProductGridSkeleton count={8} />
    </div>
  );
}
