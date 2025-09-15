"use client";

import { Button, PageHeader } from "@shared/components";
import { Calendar, Plus } from "lucide-react";
import {
  ListingCard,
  ListingFilters,
  ListingFormDialog,
  LoadingState,
  ErrorState,
  EmptyState,
  useListingData,
  useListingForm,
  useListingOperations,
  useListingFilters,
} from "./index";

export default function ListingPage() {
  const { listings, setListings, vendor, isLoading, error, refetch } = useListingData();
  const { filters, setFilters, clearFilters, filteredListings } = useListingFilters(listings);
  const {
    isAddingListing,
    editingListing,
    formData,
    isFormOpen,
    openAddForm,
    openEditForm,
    closeForm,
    updateFormData
  } = useListingForm(vendor?.id);
  const {
    handleAddListing,
    handleUpdateListing,
    handleDeleteListing,
    isSubmitting
  } = useListingOperations(vendor, setListings);

  const onSubmit = async () => {
    const success = editingListing
      ? await handleUpdateListing(editingListing, formData)
      : await handleAddListing(formData);

    if (success) {
      closeForm();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !vendor) {
    return (
      <ErrorState
        error={error || 'Vendor profile not found'}
        onRetry={refetch}
        title="Unable to load vendor profile"
      />
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-b from-white to-brand-100">
      <div className="w-full px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader 
            title="My Listings" 
            description="Manage your service listings and availability"
          />
          <Button
            onClick={openAddForm}
            className="flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Listing
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mt-8">
          <ListingFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Card View Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Card View</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredListings.length === listings.length
                  ? `${listings.length} listings displayed as cards`
                  : `${filteredListings.length} of ${listings.length} listings match your filters`
                }
              </p>
            </div>
          </div>

          {listings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No listings to display"
              description="Create your first service listing to see it here as a card"
              action={
                <Button onClick={openAddForm} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Listing
                </Button>
              }
            />
          ) : filteredListings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No listings match your filters"
              description="Try adjusting your search criteria or clear the filters"
              action={
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={openEditForm}
                  onDelete={handleDeleteListing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Listing Dialog */}
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
    </div>
  );
}