'use client';

import { ListingForm } from '../components/ListingForm';
import { ListingPageLayout } from '../components/ListingPageLayout';
import { LoadingState } from '../components/ListingPageStates';
import { useListingFormState } from '../hooks/useListingFormState';

export default function AddListingPage() {
  const {
    formData,
    handleFormDataChange,
    handleSubmit,
    handleCancel,
    isSubmitting,
    vendor
  } = useListingFormState();

  if (!vendor) {
    return <LoadingState message="Loading your vendor profile..." />;
  }

  return (
    <ListingPageLayout
      title="Add New Listing"
      description="Create a new service listing for your vendor profile"
      onBack={handleCancel}
    >
      <ListingForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Create Listing"
      />
    </ListingPageLayout>
  );
}