"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page"); // Reset pagination on sort change
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <select
      className="bg-transparent font-bold text-sm focus:outline-none cursor-pointer hover:text-[var(--etsy-orange)] transition-colors"
      defaultValue={defaultValue}
      onChange={handleSortChange}
    >
      <option value="newest">Newest First</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="popular">Most Popular</option>
    </select>
  );
}
