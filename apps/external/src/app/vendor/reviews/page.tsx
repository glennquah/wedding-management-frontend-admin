'use client';

import { useEffect, useState } from 'react';
import { ReviewResponseDto, ReviewsService } from '@shared/api';
import { PageHeader } from '@shared/components';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { Rating, RatingButton } from '@shared/components/ui/rating';
import { ChevronLeft, ChevronRight, Loader2, MessageSquare, Star, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const REVIEWS_PER_PAGE = 10;

export default function VendorReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const fetchedReviews = await ReviewsService.reviewControllerFindByVendor(session.user.id);

        // Sort by newest first
        const sortedReviews = fetchedReviews.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setReviews(sortedReviews);

        // Calculate average rating
        if (sortedReviews.length > 0) {
          const avg =
            sortedReviews.reduce((sum, review) => sum + review.rating, 0) / sortedReviews.length;
          setAverageRating(avg);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [session]);

  // Filter reviews based on selected ratings
  const filteredReviews =
    selectedRatings.length === 0
      ? reviews
      : reviews.filter((review) => selectedRatings.includes(review.rating));

  // Paginate filtered reviews
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRatings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });
    return counts;
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) => {
      if (prev.includes(rating)) {
        // Remove rating if already selected
        return prev.filter((r) => r !== rating);
      } else {
        // Add rating if not selected
        return [...prev, rating];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedRatings([]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader
          title="Reviews"
          description="See what customers are saying about your services"
        />
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:pt-6">
      <PageHeader title="Reviews" description="See what customers are saying about your services" />

      {/* Summary Statistics */}
      {reviews.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Star className="text-primary fill-primary h-8 w-8" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Average Rating</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                    <Rating value={Math.round(averageRating)} readOnly>
                      {Array.from({ length: 5 }, (_, i) => (
                        <RatingButton key={i} index={i} size={20} />
                      ))}
                    </Rating>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <MessageSquare className="text-primary h-8 w-8" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Reviews</p>
                  <p className="mt-1 text-3xl font-bold">{reviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Buttons */}
      {reviews.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Filter by rating</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRatings.length === 0 ? 'default' : 'secondary'}
              size="sm"
              onClick={clearAllFilters}
              className="gap-1"
            >
              All Reviews ({reviews.length})
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = getRatingCounts()[rating as 1 | 2 | 3 | 4 | 5];
              const isSelected = selectedRatings.includes(rating);
              return (
                <Button
                  key={rating}
                  variant={isSelected ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => toggleRating(rating)}
                  className="gap-1"
                  disabled={count === 0}
                >
                  <Star className="h-3 w-3 fill-current" />
                  {rating} Star{rating !== 1 ? 's' : ''} ({count})
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">No reviews yet</p>
              <p className="mt-2 text-sm text-gray-400">
                Reviews from customers will appear here once your services are completed
              </p>
            </CardContent>
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">No reviews match your filters</p>
              <p className="mt-2 text-sm text-gray-400">
                Try selecting different rating filters or click &quot;All Reviews&quot; to clear
                filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Customer/Wedding Info */}
                        {review.weddingCouple && (
                          <div className="mb-3 flex items-center gap-2">
                            <Users className="text-muted-foreground h-4 w-4" />
                            <span className="text-foreground font-semibold">
                              {review.weddingCouple}
                            </span>
                          </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <Rating value={review.rating} readOnly>
                            {Array.from({ length: 5 }, (_, i) => (
                              <RatingButton key={i} index={i} size={20} />
                            ))}
                          </Rating>
                          <span className="text-muted-foreground text-sm">
                            {review.rating} {review.rating === 1 ? 'star' : 'stars'}
                          </span>
                        </div>

                        {/* Comment */}
                        {review.comment && <p className="mt-3 text-gray-700">{review.comment}</p>}

                        {/* Date */}
                        <p className="text-muted-foreground mt-3 text-sm">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-muted-foreground text-sm">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredReviews.length)} of{' '}
                  {filteredReviews.length} reviews
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? 'min-w-[2.5rem]'
                                : 'min-w-[2.5rem] border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
