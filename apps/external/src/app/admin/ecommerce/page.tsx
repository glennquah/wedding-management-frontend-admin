'use client';

import { useMemo } from 'react';
import { WeddingService } from '@shared/api';
import { PageHeader } from '@shared/components';
import { CategoryCarousel } from './components/CategoryCarousel';
import { LoadingState, ErrorState, EmptyState } from './components/common';
import { useEcommerceData } from './hooks';

export default function EcommercePage() {
  const { listings, vendors, loading, error, refetch } = useEcommerceData();

  const categories = useMemo(() => Object.values(WeddingService) as WeddingService[], []);
  const totalListings = Object.values(listings).reduce((sum, categoryListings) => sum + categoryListings.length, 0);

  if (loading) {
    return <LoadingState categories={categories} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Wedding Services Marketplace"
        description={`Discover and book the perfect wedding services for your special day. Browse through our curated collection of venues, catering, photography, and more from trusted vendors. ${totalListings} total listings • ${vendors.length} trusted vendors • ${categories.length} service categories`}
      />

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
  );
}