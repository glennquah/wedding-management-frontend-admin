'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  ListingResponseDto,
  ListingsService,
  VendorResponseDto,
  VendorsService,
  WeddingService,
} from '@shared/api';
import { CategoryCarousel } from './components/CategoryCarousel';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@shared/components/ui/alert';
import { Button } from '@shared/components/ui/button';
import { AlertTriangle, ShoppingBag, RefreshCw } from 'lucide-react';

interface ListingsByCategory {
  [key: string]: ListingResponseDto[];
}

export default function EcommercePage() {
  const [listings, setListings] = useState<ListingsByCategory>({});
  const [vendors, setVendors] = useState<VendorResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => Object.values(WeddingService) as WeddingService[], []);

  const fetchListingsForCategory = async (category: WeddingService): Promise<ListingResponseDto[]> => {
    try {
      let result: ListingResponseDto[] = [];

      switch (category) {
        case WeddingService.VENUE:
          result = await ListingsService.listingControllerGetAllVenues();
          break;
        case WeddingService.CATERING:
          result = await ListingsService.listingControllerGetAllCatering();
          break;
        case WeddingService.PHOTOGRAPHY:
          result = await ListingsService.listingControllerGetAllPhotography();
          break;
        case WeddingService.DECORATION:
          result = await ListingsService.listingControllerGetAllDecoration();
          break;
        case WeddingService.MUSIC:
          result = await ListingsService.listingControllerGetAllMusic();
          break;
        case WeddingService.ATTIRE:
          result = await ListingsService.listingControllerGetAllAttire();
          break;
        case WeddingService.MAKEUP:
          result = await ListingsService.listingControllerGetAllMakeup();
          break;
        case WeddingService.TRANSPORTATION:
          result = await ListingsService.listingControllerGetAllTransportation();
          break;
        default:
          result = [];
      }

      return result;
    } catch (error) {
      console.error(`Error fetching listings for ${category}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [vendorsResult, ...listingResults] = await Promise.all([
          VendorsService.vendorControllerGetAllVendors(),
          ...categories.map(category => fetchListingsForCategory(category))
        ]);

        setVendors(vendorsResult);

        const listingsByCategory: ListingsByCategory = {};
        categories.forEach((category, index) => {
          listingsByCategory[category] = listingResults[index] || [];
        });

        setListings(listingsByCategory);
      } catch (err: any) {
        console.error('Error fetching data:', err);

        // Check if the error is due to authentication
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

    fetchAllData();
  }, [categories]);

  const totalListings = Object.values(listings).reduce((sum, categoryListings) => sum + categoryListings.length, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0">
                  <Skeleton className="h-[300px] w-[250px] rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleRetry = () => {
    setError(null);
    setLoading(true);

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [vendorsResult, ...listingResults] = await Promise.all([
          VendorsService.vendorControllerGetAllVendors(),
          ...categories.map(category => fetchListingsForCategory(category))
        ]);

        setVendors(vendorsResult);

        const listingsByCategory: ListingsByCategory = {};
        categories.forEach((category, index) => {
          listingsByCategory[category] = listingResults[index] || [];
        });

        setListings(listingsByCategory);
      } catch (err: any) {
        console.error('Error fetching data on retry:', err);
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

    fetchAllData();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-2xl mx-auto" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <div>{error}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
            {error.includes('Authentication') && (
              <div className="text-sm text-muted-foreground mt-2">
                <p>To access the admin ecommerce page, you need to:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Log in with an admin account</li>
                  <li>Ensure you have selected a wedding from the dropdown</li>
                  <li>Check that the backend API server is running on port 8080</li>
                </ol>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">Wedding Services Marketplace</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Discover and book the perfect wedding services for your special day. Browse through our curated collection
          of venues, catering, photography, and more from trusted vendors.
        </p>
        <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
          <span>{totalListings} total listings</span>
          <span>{vendors.length} trusted vendors</span>
          <span>{categories.length} service categories</span>
        </div>
      </div>

      {categories.map((category) => (
        <CategoryCarousel
          key={category}
          category={category}
          listings={listings[category] || []}
          vendors={vendors}
        />
      ))}

      {totalListings === 0 && !loading && (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No listings available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We&rsquo;re working on adding more wedding service listings. Please check back soon!
          </p>
        </div>
      )}
    </div>
  );
}