'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@shared/components/ui/button';
import { BackButton } from '../../components/ui';
import {
  ImageGallery,
  ListingHeader,
  DescriptionCard,
  AvailabilityCard,
  VendorCard,
  ListingLoadingState,
  ListingErrorState,
  ListingNotFoundState
} from '../../components/listing';
import { useListingData, usePagination } from '../../hooks';
import { formatPrice } from '../../utils';

export default function ListingPage() {
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
    router.push('/admin/ecommerce');
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
      <BackButton onBack={handleBack} />

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
            availabilities={listing.availabilities || []}
            currentPage={currentPage}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            itemsPerPage={4}
          />

          {vendor && <VendorCard vendor={vendor} />}

          <div className="w-full">
            <Button className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}