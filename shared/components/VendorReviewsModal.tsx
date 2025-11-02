'use client';

import { useEffect, useState } from 'react';
import { ReviewResponseDto, ReviewsService } from '@shared/api';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Skeleton } from './ui/skeleton';

interface VendorReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: number;
  vendorName: string;
}

export function VendorReviewsModal({
  open,
  onOpenChange,
  vendorId,
  vendorName,
}: VendorReviewsModalProps) {
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && vendorId) {
      fetchReviews();
    }
  }, [open, vendorId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReviewsService.reviewControllerFindByVendor(vendorId);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Reviews for {vendorName}</DialogTitle>
          <DialogDescription>
            All customer reviews and ratings for this vendor
          </DialogDescription>
        </DialogHeader>

        <div className="h-[500px] overflow-y-auto pr-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 p-4 border rounded-lg">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-muted-foreground text-lg">No reviews yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                This vendor hasn&apos;t received any reviews from customers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        {renderStars(review.rating)}
                        <span className="text-sm font-semibold text-gray-700">
                          {review.rating}.0
                        </span>
                      </div>
                      {review.weddingCouple && (
                        <p className="text-sm font-medium text-gray-900">
                          {review.weddingCouple}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
