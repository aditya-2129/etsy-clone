"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 0) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page));
  };

  /**
   * Logic to determine which page numbers to display.
   * Shows first/last and a window around the current page with ellipses.
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 7;

    if (totalPages <= showMax) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(0);

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      if (start > 1) {
        pages.push("ellipsis-1");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push("ellipsis-2");
      }

      // Always show last page
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-16 pb-12">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 sm:h-11 sm:w-11 border-border shadow-sm disabled:opacity-30 hover:bg-muted"
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {getPageNumbers().map((page, index) => {
            if (typeof page === "string") {
              return (
                <span key={page} className="px-1 text-muted-foreground/50">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isActive = currentPage === page;
            return (
              <Button
                key={page}
                variant={isActive ? "default" : "ghost"}
                className={`rounded-full h-10 w-10 sm:h-11 sm:w-11 font-bold transition-all ${
                  isActive 
                    ? "bg-foreground text-background shadow-md scale-110 z-10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page + 1}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page + 1}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 sm:h-11 sm:w-11 border-border shadow-sm disabled:opacity-30 hover:bg-muted"
          disabled={currentPage >= totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Page {currentPage + 1} of {totalPages}
      </p>
    </div>
  );
}
