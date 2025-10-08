import { useEffect, useState } from 'react';
import { ListingResponseDto, VendorResponseDto, VendorsService, ListingsService } from '@shared/api';

interface UseVendorDataReturn {
  vendor: VendorResponseDto | null;
  listings: ListingResponseDto[];
  loading: boolean;
  error: string | null;
}

export function useVendorData(vendorId: string): UseVendorDataReturn {
  const [vendor, setVendor] = useState<VendorResponseDto | null>(null);
  const [listings, setListings] = useState<ListingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorAndListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const vendorData = await VendorsService.vendorControllerGetVendor(parseInt(vendorId));
        const listingsData = await ListingsService.listingControllerSearch(parseInt(vendorId), '');

        setVendor(vendorData);
        setListings(listingsData);
      } catch (err: unknown) {
        console.error('Error fetching vendor:', err);

        const error = err as { status?: number };
        if (error?.status === 404) {
          setError('Vendor not found. It may have been removed or the ID is incorrect.');
        } else if (error?.status === 401) {
          setError('Authentication required. Please ensure you are logged in with admin privileges.');
        } else {
          setError('Failed to load vendor details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorAndListings();
    }
  }, [vendorId]);

  return {
    vendor,
    listings,
    loading,
    error
  };
}
