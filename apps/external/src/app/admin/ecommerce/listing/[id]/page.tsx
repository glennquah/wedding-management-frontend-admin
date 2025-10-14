'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
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
import { useCartStore } from '../../../../store/sessionStore';
import type { AvailabilitySlotDto } from '@shared/api';
import { toast } from 'sonner';

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
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

  const { addItem, fetchCart, cartItems } = useCartStore();
  const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlotDto[]>([]);

  // Fetch cart items when the component mounts
  useEffect(() => {
    if (session?.user?.id) {
      fetchCart(Number(session.user.id));
    }
  }, [session?.user?.id, fetchCart]);

  // Get slots that are already in cart for this listing
  const slotsInCart = useMemo(() => {
    const cartItem = cartItems.find(item => item.listingId === parseInt(listingId));
    return cartItem?.selectedSlots || [];
  }, [cartItems, listingId]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleBack = () => {
    router.push('/admin/ecommerce');
  };

  const toggleSlotSelection = (slot: AvailabilitySlotDto) => {
    setSelectedSlots(prev => {
      const isSelected = prev.some(s =>
        s.startTime === slot.startTime &&
        s.endTime === slot.endTime &&
        s.date === slot.date
      );

      return isSelected
        ? prev.filter(s =>
            !(s.startTime === slot.startTime &&
              s.endTime === slot.endTime &&
              s.date === slot.date)
          )
        : [...prev, slot];
    });
  };

  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      toast.error('Please log in to add items to cart');
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error('Please select at least one availability slot');
      return;
    }

    if (!listing) {
      toast.error('Listing not found');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItem(
        session.user.id,
        {
          id: listing.id.toString(),
          name: listing.listingName,
          price: listing.price,
          image: listing.imageUrls[0] || '',
          category: 'listing'
        },
        selectedSlots
      );
      toast.success('Successfully added to cart!');
      setSelectedSlots([]);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
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
            selectedSlots={selectedSlots}
            onSlotToggle={toggleSlotSelection}
            slotsInCart={slotsInCart}
          />

          {vendor && <VendorCard vendor={vendor} />}

          <div className="w-full">
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isAddingToCart || selectedSlots.length === 0}
            >
              {isAddingToCart ? 'Adding to Cart...' : `Add to Cart ${selectedSlots.length > 0 ? `(${selectedSlots.length} slot${selectedSlots.length > 1 ? 's' : ''})` : ''}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}