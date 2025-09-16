"use client";

import { Button, PageHeader } from "@shared/components";
import { Calendar, Plus } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  ListingCard,
  ListingFilters,
  ListingFormDialog,
  LoadingState,
  useListingData,
  useListingFilters,
  useListingForm,
  useListingOperations,
} from "./index";

export default function ListingPage() {
  const { listings, setListings, vendor, isLoading, error, refetch } = useListingData();
  const { filters, setFilters, clearFilters, filteredListings } = useListingFilters(listings);
  const { editingListing, formData, isFormOpen, openAddForm, openEditForm, closeForm, updateFormData } = useListingForm(vendor?.id);
  const { handleAddListing, handleUpdateListing, handleDeleteListing, isSubmitting } = useListingOperations(vendor, setListings);

  const onSubmit = async () => {
    const success = editingListing
      ? await handleUpdateListing(editingListing, formData)
      : await handleAddListing(formData);
    if (success) closeForm();
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
          onEdit={openEditForm}
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
          <Button onClick={openAddForm} className="flex items-center gap-2 self-start lg:self-auto">
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

      <ListingFormDialog
        open={isFormOpen}
        onOpenChange={(open) => !open && closeForm()}
        editingListing={editingListing}
        formData={formData}
        onFormDataChange={updateFormData}
        onSubmit={onSubmit}
        onCancel={closeForm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}