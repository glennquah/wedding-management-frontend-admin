'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReviewResponseDto, ReviewsService } from '@shared/api';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Rating, RatingButton } from './ui/rating';
import { Textarea } from './ui/textarea';

interface RateVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorName: string;
  vendorId: number;
  orderId: number;
  listingId: number;
  existingReview?: ReviewResponseDto | null;
  onReviewSubmitted?: () => void;
}

export function RateVendorModal({
  open,
  onOpenChange,
  vendorName,
  vendorId,
  orderId,
  listingId,
  existingReview,
  onReviewSubmitted,
}: RateVendorModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when editing existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
  }, [existingReview, open]);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create new review
      await ReviewsService.reviewControllerCreate({
        rating,
        comment: comment.trim() || undefined,
        orderId,
        listingId,
        vendorId,
      });

      toast.success('Review submitted successfully!');
      onOpenChange(false);
      onReviewSubmitted?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset to defaults when creating a new review
    setRating(5);
    setComment('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? `Your Rating for ${vendorName}` : `Rate ${vendorName}`}
          </DialogTitle>
          <DialogDescription>
            {existingReview
              ? 'This is the review you submitted for this vendor.'
              : 'Share your experience with this vendor to help other couples make informed decisions.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Rating
            </label>
            <div className="flex items-center gap-2">
              <Rating value={rating} onValueChange={setRating} readOnly={!!existingReview}>
                {Array.from({ length: 5 }, (_, i) => (
                  <RatingButton key={i} index={i} size={32} />
                ))}
              </Rating>
              <span className="text-muted-foreground text-sm">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Review (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience with this vendor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={1000}
              className="resize-none"
              disabled={!!existingReview}
            />
            {!existingReview && (
              <p className="text-muted-foreground text-xs">{comment.length}/1000 characters</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="darkOutline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          {!existingReview && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
