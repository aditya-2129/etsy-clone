"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  productId: string;
  productTitle: string;
  buyerId: string;
  reviewerName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export function ReviewModal({
  productId,
  productTitle,
  buyerId,
  reviewerName,
  isOpen,
  onOpenChange,
  onSubmit
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(rating, comment);
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription className="line-clamp-2">
            Share your experience with {productTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Rating
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={cn(
                    "p-1 transition-all",
                    isSubmitting && "cursor-not-allowed opacity-50"
                  )}
                  onMouseEnter={() => !isSubmitting && setHoverRating(star)}
                  onMouseLeave={() => !isSubmitting && setHoverRating(0)}
                  onClick={() => !isSubmitting && setRating(star)}
                  disabled={isSubmitting}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-all",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-transparent text-muted-foreground stroke-1"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Add a written review (optional)
            </label>
            <Textarea
              id="comment"
              placeholder="What did you like or dislike? What did you use this product for?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="resize-none h-32"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || rating === 0}
            className="rounded-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
