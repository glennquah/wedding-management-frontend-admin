import { useEffect, useState, useMemo } from 'react';
import { VendorResponseDto, WeddingService } from '@shared/api';
import { EcommerceService, ListingsByCategory } from '../services';

interface UseEcommerceDataReturn {
  listings: ListingsByCategory;
  vendors: VendorResponseDto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEcommerceData(): UseEcommerceDataReturn {
  const [listings, setListings] = useState<ListingsByCategory>({});
  const [vendors, setVendors] = useState<VendorResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => Object.values(WeddingService) as WeddingService[], []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { vendors: vendorsResult, listings: listingsResult } =
        await EcommerceService.fetchAllEcommerceData(categories);

      setVendors(vendorsResult);
      setListings(listingsResult);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);

      const error = err as { status?: number; message?: string; code?: string };
      if (error?.status === 401 || error?.message?.includes('Unauthorized')) {
        setError('Authentication required. Please ensure you are logged in with admin privileges.');
      } else if (error?.message?.includes('Failed to fetch') || error?.code === 'ECONNREFUSED') {
        setError('Unable to connect to the backend server. Please ensure the API server is running.');
      } else {
        setError('Failed to load listings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    listings,
    vendors,
    loading,
    error,
    refetch: fetchAllData
  };
}