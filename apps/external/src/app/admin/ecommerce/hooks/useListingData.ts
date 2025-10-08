import { useEffect, useState } from 'react';
import { ListingResponseDto, VendorResponseDto } from '@shared/api';
import { ListingService } from '../services';

interface UseListingDataReturn {
  listing: ListingResponseDto | null;
  vendor: VendorResponseDto | null;
  loading: boolean;
  error: string | null;
}

export function useListingData(listingId: string): UseListingDataReturn {
  const [listing, setListing] = useState<ListingResponseDto | null>(null);
  const [vendor, setVendor] = useState<VendorResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListingAndVendor = async () => {
      try {
        setLoading(true);
        setError(null);

        const { listing: listingData, vendor: vendorData } =
          await ListingService.fetchListingWithVendor(parseInt(listingId));

        setListing(listingData);
        setVendor(vendorData);
      } catch (err: unknown) {
        console.error('Error fetching listing:', err);

        const error = err as { status?: number };
        if (error?.status === 404) {
          setError('Listing not found. It may have been removed or the ID is incorrect.');
        } else if (error?.status === 401) {
          setError('Authentication required. Please ensure you are logged in with admin privileges.');
        } else {
          setError('Failed to load listing details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListingAndVendor();
    }
  }, [listingId]);

  return {
    listing,
    vendor,
    loading,
    error
  };
}