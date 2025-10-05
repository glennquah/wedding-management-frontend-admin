import { ListingsService, VendorRecommendationService, VendorResponseDto, VendorsService } from '@shared/api';
import { useEffect, useState } from 'react';
import { VendorWithScore } from '../components/VendorCard';

export function useRecommendations(vendors: VendorResponseDto[], weddingId?: number) {
  const [recommendedVendors, setRecommendedVendors] = useState<VendorWithScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!weddingId || !vendors.length) {
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await VendorRecommendationService.vendorRecommendationControllerGetVendorRecommendations({
          wedding_id: weddingId,
          top_k: 20,
        });

        if (response.success && response.recommendations) {
          // Fetch full vendor details for each recommended vendor
          const vendorsWithScores = await Promise.all(
            response.recommendations.map(async (score) => {
              try {
                const vendorDetails = await VendorsService.vendorControllerGetVendor(score.vendor_id);
                return {
                  id: vendorDetails.id,
                  name: vendorDetails.name || 'Unknown Vendor',
                  serviceOffered: vendorDetails.serviceOffered || 'N/A',
                  styleOffered: vendorDetails.styleOffered || 'N/A',
                  rating: vendorDetails.rating || 0,
                  bio: vendorDetails.bio,
                  score,
                } as VendorWithScore;
              } catch (err) {
                console.error(`Error fetching vendor details for ${score.vendor_id}:`, err);
                // Fallback to basic vendor info from the vendors array
                const vendor = vendors.find(v => v.id === score.vendor_id);
                if (!vendor) return null;
                return {
                  id: vendor.id,
                  name: vendor.name || 'Unknown Vendor',
                  serviceOffered: vendor.serviceOffered || 'N/A',
                  styleOffered: vendor.styleOffered || 'N/A',
                  rating: vendor.rating || 0,
                  bio: vendor.bio,
                  score,
                } as VendorWithScore;
              }
            })
          );

          // Filter out null values
          const validVendors = vendorsWithScores.filter((v): v is VendorWithScore => v !== null);

          // Fetch cheapest listing for each vendor
          const vendorsWithPrices = await Promise.all(
            validVendors.map(async (vendor) => {
              try {
                const cheapestListing = await ListingsService.listingControllerGetCheapestListingForVendor(vendor.id);
                return {
                  ...vendor,
                  cheapestListing: cheapestListing || null,
                  startingPrice: cheapestListing?.price || null
                };
              } catch (err) {
                console.error(`Error fetching price for vendor ${vendor.id}:`, err);
                return {
                  ...vendor,
                  cheapestListing: null,
                  startingPrice: null
                };
              }
            })
          );

          setRecommendedVendors(vendorsWithPrices);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [weddingId, vendors]);

  return { recommendedVendors, loading, error };
}
