'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  ImageGallery,
  ListingHeader,
  DescriptionCard,
  AvailabilityCard,
  VendorCard,
  ListingLoadingState,
  ListingErrorState,
  ListingNotFoundState
} from '../components/listing';
import { useListingData } from '../hooks/useListingData';
import { usePagination } from '../hooks/usePagination';
import { formatPrice } from '../utils/formatPrice';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id as string;

  const { listing, vendor, loading, error } = useListingData(listingId);
  const {
    currentPage,
    handlePreviousPage,
    handleNextPage
  } = usePagination({
    items: listing?.availabilities || [],
    itemsPerPage: 4
  });

  const handleBack = () => {
    router.push('/listing-management');
  };

  if (!listingId) {
    return <ListingNotFoundState onBack={handleBack} />;
  }

  if (loading) {
    return <ListingLoadingState />;
  }

  if (error) {
    return <ListingErrorState error={error} onBack={handleBack} />;
  }

  if (!listing) {
    return <ListingNotFoundState onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <ImageGallery
          imageUrls={listing.imageUrls}
          listingName={listing.listingName}
        />

        <div className="space-y-6">
          <ListingHeader
            listing={listing}
            vendor={vendor}
            formatPrice={formatPrice}
          />

          <DescriptionCard remarks={listing.remarks} />

          <AvailabilityCard
            availabilities={(listing.availabilities || []).filter(
              (slot): slot is { date: string; startTime: string; endTime: string } =>
                !!slot.date && !!slot.startTime && !!slot.endTime
            )}
            currentPage={currentPage}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            itemsPerPage={4}
          />

          {vendor && <VendorCard vendor={vendor} />}
        </div>
      </div>
    </div>
  );
}
