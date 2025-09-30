'use client';

import { ListingFilters } from '@/app/vendor/listing/filters';
import { WeddingService } from '@shared/api';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo, useState } from 'react';
import { ListingsGrid } from '../../components/ListingsGrid';
import { EmptyState, ErrorState } from '../../components/common';
import { BackButton } from '../../components/ui';
import { useEcommerceData } from '../../hooks';

interface FilterOptions {
  searchQuery: string;
  vendorSearchQuery?: string;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  rating?: number | null;
  sortBy: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  priceRange: {
    min: null,
    max: null,
  },
  sortBy: 'name',
  sortOrder: 'asc',
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const categoryDisplayNames: Record<WeddingService, string> = {
  [WeddingService.VENUE]: 'Venues',
  [WeddingService.CATERING]: 'Catering',
  [WeddingService.PHOTOGRAPHY]: 'Photography',
  [WeddingService.DECORATION]: 'Decoration',
  [WeddingService.MUSIC]: 'Music',
  [WeddingService.ATTIRE]: 'Attire',
  [WeddingService.MAKEUP]: 'Makeup',
  [WeddingService.TRANSPORTATION]: 'Transportation',
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter();
  const { category: categoryParam } = use(params);
  const { listings, vendors, loading, error, refetch } = useEcommerceData();
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const category = useMemo(() => {
    const normalized = categoryParam.toUpperCase();
    return Object.values(WeddingService).find(
      (service) => service === normalized
    ) as WeddingService | undefined;
  }, [categoryParam]);

  const categoryListings = useMemo(() => {
    if (!category) return [];
    return listings[category] || [];
  }, [category, listings]);

  const filteredListings = useMemo(() => {
    let result = [...categoryListings];

    // Apply search filter for listing name
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(listing =>
        listing.listingName.toLowerCase().includes(query)
      );
    }

    // Apply search filter for vendor name
    if (filters.vendorSearchQuery?.trim()) {
      const query = filters.vendorSearchQuery.toLowerCase().trim();
      result = result.filter(listing => {
        const vendor = vendors.find(v => v.id === listing.vendorId);
        return vendor && vendor.name && vendor.name.toLowerCase().includes(query);
      });
    }

    // Apply price range filter
    if (filters.priceRange.min !== null) {
      result = result.filter(listing => listing.price >= filters.priceRange.min!);
    }
    if (filters.priceRange.max !== null) {
      result = result.filter(listing => listing.price <= filters.priceRange.max!);
    }

    // Apply rating filter
    if (filters.rating !== null && filters.rating !== undefined) {
      result = result.filter(listing => {
        // Get vendor for this listing to access rating
        const vendor = vendors.find(v => v.id === listing.vendorId);
        return vendor && vendor.rating != null && vendor.rating >= filters.rating!;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareValue = 0;

      switch (filters.sortBy) {
        case 'name':
          compareValue = a.listingName.localeCompare(b.listingName);
          break;
        case 'price':
          compareValue = a.price - b.price;
          break;
        case 'createdAt':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          compareValue = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          compareValue = 0;
      }

      return filters.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [categoryListings, filters, vendors]);

  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onBack={() => router.push('/admin/ecommerce')} />
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onBack={() => router.push('/admin/ecommerce')} />
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onBack={() => router.push('/admin/ecommerce')} />
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Category</h1>
          <p className="text-muted-foreground">The category you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton onBack={() => router.push('/admin/ecommerce')} />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {categoryDisplayNames[category]}
        </h1>
        <p className="text-lg text-muted-foreground">
          {filteredListings.length === categoryListings.length
            ? `${categoryListings.length} ${categoryListings.length === 1 ? 'listing' : 'listings'} available`
            : `${filteredListings.length} of ${categoryListings.length} ${categoryListings.length === 1 ? 'listing' : 'listings'} match your filters`
          }
        </p>
      </div>

      <div className="mb-6">
        <ListingFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
          showRatingFilter
          showVendorSearch
        />
      </div>

      <ListingsGrid listings={filteredListings} vendors={vendors} />

      {filteredListings.length === 0 && categoryListings.length > 0 && (
        <EmptyState loading={loading} totalListings={0} />
      )}
      {categoryListings.length === 0 && (
        <EmptyState loading={loading} totalListings={0} />
      )}
    </div>
  );
}