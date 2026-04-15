import React from "react";
import { LucideIcon } from "lucide-react";

interface StaticInfoPageProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function StaticInfoPage({ title, subtitle, icon: Icon, children }: StaticInfoPageProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:py-16">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        {Icon && (
          <div className="p-3 rounded-2xl bg-[var(--etsy-orange)]/10 text-[var(--etsy-orange)] mb-2">
            <Icon className="h-10 w-10" />
          </div>
        )}
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-sm">
        {children}
      </div>
    </div>
  );
}
