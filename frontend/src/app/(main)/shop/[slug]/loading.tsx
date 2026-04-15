import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container py-8 max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* Banner Skeleton */}
      <div className="h-48 md:h-64 rounded-xl md:rounded-2xl bg-muted overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/30 animate-pulse" />
      </div>

      {/* Header Info Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16 px-4 md:px-8 relative z-10">
        <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-2xl border-4 border-background shadow-xl" />
        <div className="flex-1 space-y-3 pb-2 w-full">
          <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="px-4 md:px-8 flex gap-8 border-y py-6 border-border/50">
        <div className="space-y-2">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="space-y-2 border-l border-border/50 pl-8">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8 pt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
