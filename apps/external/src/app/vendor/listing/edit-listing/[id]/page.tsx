'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { ListingForm } from '../../components/ListingForm';
import { ListingPageLayout } from '../../components/ListingPageLayout';
import { LoadingState, ErrorState } from '../../components/ListingPageStates';
import { useListingFormState } from '../../hooks/useListingFormState';
import { useIndividualListing } from '../../hooks/useIndividualListing';

export default function EditListingPage() {
  const params = useParams();
  const listingId = parseInt((params?.id as string) || '0');

  // Use the new hook to directly fetch the individual listing
  const { listing: editingListing, isLoading, error } = useIndividualListing(listingId);

  // Initialize form state with the found listing data
  const initialData = useMemo(() => editingListing ? {
    listingName: editingListing.listingName,
    price: editingListing.price,
    availabilities: [...editingListing.availabilities],
    remarks: editingListing.remarks,
    vendorId: editingListing.vendorId,
    imageUrls: editingListing.imageUrls ? [...editingListing.imageUrls] : []
  } : undefined, [editingListing]);

  const {
    formData,
    handleFormDataChange,
    handleSubmit,
    handleCancel,
    isSubmitting
  } = useListingFormState({
    initialData,
    editingListing
  });

  if (isLoading) {
    return <LoadingState message="Loading listing details..." />;
  }

  if (error || !editingListing) {
    return (
      <ErrorState
        message={error || 'Listing not found'}
        onBack={handleCancel}
      />
    );
  }

  return (
    <ListingPageLayout
      title="Edit Listing"
      description={`Editing: ${editingListing.listingName}`}
      onBack={handleCancel}
    >
      <ListingForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Update Listing"
      />
    </ListingPageLayout>
  );
}