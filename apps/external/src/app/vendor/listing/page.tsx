"use client";

import { Button, PageHeader } from "@shared/components";
import { Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  EmptyState,
  ErrorState,
  ListingCard,
  ListingFilters,
  LoadingState,
  useListingData,
  useListingFilters,
  useListingOperations,
} from "./index";

export default function ListingPage() {
  const router = useRouter();
  const { listings, setListings, vendor, isLoading, error, refetch } = useListingData();
  const { filters, setFilters, clearFilters, filteredListings } = useListingFilters(listings);
  const { handleDeleteListing } = useListingOperations(vendor, setListings);

  const handleAddListing = () => {
    router.push('/vendor/listing/add-listing');
  };

  const handleEditListing = (listing: any) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
      {filteredListings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onEdit={handleEditListing}
          onDelete={handleDeleteListing}
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
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100">
      <div className="w-full p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <PageHeader
            title="My Listings"
            description="Manage your service listings and availability"
          />
          <Button onClick={handleAddListing} className="flex items-center gap-2 self-start lg:self-auto">
            <Plus className="w-4 h-4" />
            Add New Listing
          </Button>
        </div>

        <div className="mb-6">
          <ListingFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Listings</h2>
              <p className="text-sm text-gray-600 mt-1">{listingCount}</p>
            </div>
          </div>
          {emptyState || getListingGrid()}
        </div>
      </div>
    </div>
  );
}