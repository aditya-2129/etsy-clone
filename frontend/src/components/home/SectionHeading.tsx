import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * Reusable section heading for homepage product grids.
 * Renders a title, optional subtitle, and optional "View all" link.
 */
export default function SectionHeading({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "See more",
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--etsy-orange)] hover:underline underline-offset-4 transition-colors shrink-0"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
