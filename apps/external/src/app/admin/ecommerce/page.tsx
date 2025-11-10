'use client';

import { useWeddingStore } from '@/app/store/sessionStore';
import { WeddingService } from '@shared/api';
import { PageHeader } from '@shared/components';
import { useMemo } from 'react';
import { CategoryCarousel } from './components/CategoryCarousel';
import { RecommendedVendorsCarousel } from './components/RecommendedVendorsCarousel';
import { EmptyState, ErrorState, LoadingState } from './components/common';
import { useEcommerceData } from './hooks';
import { useRecommendations } from './hooks/useRecommendations';

export default function EcommercePage() {
  const { listings, vendors, loading, error, refetch } = useEcommerceData();
  const { selectedWeddingId } = useWeddingStore();

  const weddingId = selectedWeddingId;

  const { recommendedVendors, loading: recommendationsLoading } = useRecommendations(vendors, weddingId ?? undefined);

  const categories = useMemo(() => Object.values(WeddingService) as WeddingService[], []);
  const totalListings = Object.values(listings).reduce((sum, categoryListings) => sum + categoryListings.length, 0);

  if (loading) {
    return <LoadingState categories={categories} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      <div className='container mx-auto px-4 py-8'>
      <PageHeader
        title='Wedding Services Marketplace'
        description={`Discover and book the perfect wedding services for your special day. Browse through our curated collection of venues, catering, photography, and more from trusted vendors. ${totalListings} total listings • ${vendors.length} trusted vendors • ${categories.length} service categories`}
      />

      {/* Recommended Vendors Section - Show at the top */}
      {weddingId && (
        <RecommendedVendorsCarousel
          vendors={recommendedVendors}
          loading={recommendationsLoading}
        />
      )}

      {categories.map((category) => (
        <CategoryCarousel
          key={category}
          category={category}
          listings={listings[category] || []}
          vendors={vendors}
        />
      ))}

      <EmptyState loading={loading} totalListings={totalListings} />
      </div>
    </div>
  );
}