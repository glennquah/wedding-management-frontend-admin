import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { VendorResponseDto, VendorsService } from '@shared/api';
import { toast } from 'sonner';
import { Listing, UseListingDataReturn } from '../types';

export function useListingData(): UseListingDataReturn {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [vendor, setVendor] = useState<VendorResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorAndListings = useCallback(async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const vendorResponse = await VendorsService.vendorControllerGetVendorByEmail(session.user.email);
      setVendor(vendorResponse);

      // TODO: Fetch existing listings when backend endpoint is available
      // const listings = await ListingsService.getListingsByVendor(vendorResponse.id);
      // setListings(listings);
      setListings([]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to fetch vendor data:', err);
      setError(`Failed to load vendor data: ${errorMessage}`);
      toast.error('Failed to load vendor information');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchVendorAndListings();
  }, [fetchVendorAndListings]);

  return {
    listings,
    setListings,
    vendor,
    isLoading,
    error,
    refetch: fetchVendorAndListings
  };
}