"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="h-20 w-20 text-[var(--etsy-warning)] mb-6" />
      <h1 className="font-heading text-4xl font-bold mb-3">
        Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Please try again or return to the
        homepage.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
}
