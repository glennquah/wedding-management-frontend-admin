import { useState, useCallback } from 'react';
import { CreateListingDto } from '@shared/api';
import { Listing, UseListingFormReturn } from '../types';

const getInitialFormData = (vendorId?: number): Partial<CreateListingDto> => ({
  listingName: "",
  price: 0,
  availabilities: [],
  remarks: "",
  vendorId: vendorId || 0
});

export function useListingForm(vendorId?: number): UseListingFormReturn {
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<Partial<CreateListingDto>>(getInitialFormData(vendorId));

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData(vendorId));
  }, [vendorId]);

  const openAddForm = useCallback(() => {
    resetForm();
    setIsAddingListing(true);
  }, [resetForm]);

  const openEditForm = useCallback((listing: Listing) => {
    if (!listing.id) {
      console.error('Attempted to edit listing without valid ID:', listing);
      return;
    }

    setEditingListing(listing);
    setFormData({
      listingName: listing.listingName,
      price: listing.price,
      availabilities: [...listing.availabilities],
      remarks: listing.remarks,
      vendorId: listing.vendorId
    });
  }, []);

  const closeForm = useCallback(() => {
    setIsAddingListing(false);
    setEditingListing(null);
    resetForm();
  }, [resetForm]);

  const updateFormData = useCallback((updates: Partial<CreateListingDto>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    isAddingListing,
    editingListing,
    formData,
    isFormOpen: isAddingListing || !!editingListing,
    openAddForm,
    openEditForm,
    closeForm,
    updateFormData,
    resetForm
  };
}