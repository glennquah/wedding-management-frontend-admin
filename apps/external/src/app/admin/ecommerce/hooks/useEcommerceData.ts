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
    } catch (err: any) {
      console.error('Error fetching data:', err);

      if (err?.status === 401 || err?.message?.includes('Unauthorized')) {
        setError('Authentication required. Please ensure you are logged in with admin privileges.');
      } else if (err?.message?.includes('Failed to fetch') || err?.code === 'ECONNREFUSED') {
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
  }, [categories]);

  return {
    listings,
    vendors,
    loading,
    error,
    refetch: fetchAllData
  };
}