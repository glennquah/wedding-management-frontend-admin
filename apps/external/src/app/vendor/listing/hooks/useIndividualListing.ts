import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { VendorResponseDto, VendorsService, ListingsService } from '@shared/api';
import { toast } from 'sonner';
import { Listing } from '../types';

interface UseIndividualListingReturn {
  listing: Listing | null;
  vendor: VendorResponseDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useIndividualListing(listingId: number): UseIndividualListingReturn {
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [vendor, setVendor] = useState<VendorResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListingData = useCallback(async () => {
    if (!session?.user?.email || !listingId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First get the vendor info
      const vendorResponse = await VendorsService.vendorControllerGetVendorByEmail(session.user.email);
      setVendor(vendorResponse);

      // Then fetch the specific listing
      const listingResponse = await ListingsService.listingControllerFindById(listingId);

      // Transform the response to match our Listing type
      const fetchedListing: Listing = {
        id: listingResponse.id,
        listingName: listingResponse.listingName,
        price: listingResponse.price,
        availabilities: listingResponse.availabilities || [],
        remarks: listingResponse.remarks || "",
        vendorId: listingResponse.vendorId,
        createdAt: listingResponse.createdAt || new Date().toISOString(),
        updatedAt: listingResponse.updatedAt || new Date().toISOString(),
        imageUrls: listingResponse.imageUrls || []
      };

      setListing(fetchedListing);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to fetch listing data:', err);
      setError(`Failed to load listing data: ${errorMessage}`);
      toast.error('Failed to load listing information');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, listingId]);

  useEffect(() => {
    fetchListingData();
  }, [fetchListingData]);

  return {
    listing,
    vendor,
    isLoading,
    error,
    refetch: fetchListingData
  };
}