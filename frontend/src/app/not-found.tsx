import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <SearchX className="h-20 w-20 text-muted-foreground/40 mb-6" />
      <h1 className="font-heading text-4xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, we couldn't find what you're looking for. The page may have been
        moved, deleted, or never existed.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
