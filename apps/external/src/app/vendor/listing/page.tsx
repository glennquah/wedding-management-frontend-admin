'use client';

import { Button } from '@shared/components';
import { Calendar, Plus, ListChecks } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  EmptyState,
  ErrorState,
  ListingCard,
  ListingFilters,
  LoadingState,
  useListingData,
  useListingFilters,
  useListingOperations,
} from './index';

export default function ListingPage() {
  const router = useRouter();
  const { listings, setListings, vendor, isLoading, error, refetch } = useListingData();
  const { filters, setFilters, clearFilters, filteredListings } = useListingFilters(listings);
  const { handleDeleteListing } = useListingOperations(vendor, setListings);

  const handleAddListing = () => {
    router.push('/vendor/listing/add-listing');
  };

  const handleEditListing = (listing: { id: number }) => {
    router.push(`/vendor/listing/edit-listing/${listing.id}`);
  };

  const getEmptyState = () => {
    if (listings.length === 0) {
      return (
        <EmptyState
          icon={Calendar}
          title="No listings to display"
          description="Create your first service listing to see it here"
        />
      );
    }
    if (filteredListings.length === 0) {
      return (
        <EmptyState
          icon={Calendar}
          title="No listings match your filters"
          description="Try adjusting your search criteria or clear the filters"
          action={<Button onClick={clearFilters} variant="outline">Clear Filters</Button>}
        />
      );
    }
    return null;
  };

  const getListingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 auto-rows-fr">
      {filteredListings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onEdit={handleEditListing}
          onDelete={handleDeleteListing}
          serviceType={vendor?.serviceOffered}
        />
      ))}
    </div>
  );

  if (isLoading) return <LoadingState />;
  if (error || !vendor) {
    return (
      <ErrorState
        error={error || 'Vendor profile not found'}
        onRetry={refetch}
        title="Unable to load vendor profile"
      />
    );
  }

  const emptyState = getEmptyState();
  const listingCount = filteredListings.length === listings.length
    ? `${listings.length} listings`
    : `${filteredListings.length} of ${listings.length} listings match your filters`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ListChecks className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900">My Listings</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mb-4">
              Manage your service listings and availability. Create, edit, and monitor your wedding service offerings to attract more clients.
            </p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-gray-700">{vendor.serviceOffered}</span>
              <span>{listingCount}</span>
            </div>
          </div>
          <Button onClick={handleAddListing} className="flex items-center gap-2 self-start lg:self-auto mt-4 lg:mt-0">
            <Plus className="w-4 h-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <ListingFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
      </div>

      <div className="mb-6">
        {emptyState || getListingGrid()}
      </div>
    </div>
  );
}