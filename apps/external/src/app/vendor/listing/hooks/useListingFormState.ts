import { CreateListingDto } from '@shared/api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useListingData, useListingOperations } from '../index';
import { Listing } from '../types';

interface UseListingFormStateOptions {
  initialData?: Partial<CreateListingDto> & { imageUrls?: string[] };
  editingListing?: Listing | null;
  redirectPath?: string;
}

export function useListingFormState({
  initialData,
  editingListing,
  redirectPath = '/vendor/listing'
}: UseListingFormStateOptions = {}) {
  const router = useRouter();
  const { vendor } = useListingData();
  const { handleAddListing, handleUpdateListing, isSubmitting } = useListingOperations(vendor, () => {});
  const initializedRef = useRef(false);

  const [formData, setFormData] = useState<Partial<CreateListingDto> & { imageUrls?: string[] }>(() => {
    const defaultData = {
      listingName: '',
      price: 0,
      availabilities: [],
      remarks: '',
      vendorId: vendor?.id || 0,
      imageUrls: []
    };

    if (initialData && editingListing) {
      return { ...defaultData, ...initialData };
    }

    return defaultData;
  });

  // Update form data when initialData and editingListing become available
  useEffect(() => {
    if (initialData && editingListing && !initializedRef.current) {
      const defaultData = {
        listingName: '',
        price: 0,
        availabilities: [],
        remarks: '',
        vendorId: vendor?.id || 0,
        imageUrls: []
      };
      setFormData({ ...defaultData, ...initialData });
      initializedRef.current = true;
    }
  }, [initialData, editingListing, vendor?.id]);


  const handleFormDataChange = useCallback((updates: Partial<CreateListingDto> & { imageUrls?: string[] }) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSubmit = useCallback(async () => {
    let success = false;

    if (editingListing) {
      success = await handleUpdateListing(editingListing, formData);
    } else {
      success = await handleAddListing(formData);
    }

    if (success) {
      router.push(redirectPath);
    }
  }, [editingListing, formData, handleAddListing, handleUpdateListing, router, redirectPath]);

  const handleCancel = useCallback(() => {
    router.push(redirectPath);
  }, [router, redirectPath]);

  return {
    formData,
    setFormData,
    handleFormDataChange,
    handleSubmit,
    handleCancel,
    isSubmitting,
    vendor
  };
}