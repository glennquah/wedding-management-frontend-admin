import { useCallback, useState } from 'react';
import { CreateListingDto, ListingsService, UpdateListingDto, VendorResponseDto } from '@shared/api';
import { toast } from 'sonner';
import { Listing, UseListingOperationsReturn } from '../types';
import { MESSAGES, VALIDATION_RULES } from '../constants';

export function useListingOperations(
  vendor: VendorResponseDto | null,
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>
): UseListingOperationsReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddListing = useCallback(async (listingData: Partial<CreateListingDto>): Promise<boolean> => {
    if (!vendor?.id) {
      toast.error(MESSAGES.ERROR.VENDOR_UNAVAILABLE);
      return false;
    }

    if (!listingData.listingName?.trim() ||
        listingData.listingName.trim().length < VALIDATION_RULES.LISTING_NAME.MIN_LENGTH ||
        !listingData.price ||
        isNaN(listingData.price) ||
        listingData.price < VALIDATION_RULES.PRICE.MIN) {
      toast.error(MESSAGES.ERROR.VALIDATION_FAILED);
      return false;
    }

    try {
      setIsSubmitting(true);
      const createData: CreateListingDto = {
        listingName: listingData.listingName.trim(),
        price: Number(listingData.price),
        availabilities: listingData.availabilities || [],
        remarks: listingData.remarks?.trim() || "",
        vendorId: vendor.id,
        imageUrls: listingData.imageUrls || []
      };

      const response = await ListingsService.listingControllerCreate(createData);

      if (!response?.id) {
        console.error('Backend did not return a valid listing with ID:', response);
        toast.error('Listing created but may not be editable. Please refresh the page.');
        return false;
      }

      // Add the new listing to the list using the actual response data
      const createdListing: Listing = {
        id: response.id,
        listingName: response.listingName || createData.listingName,
        price: response.price || createData.price,
        availabilities: response.availabilities || createData.availabilities,
        remarks: response.remarks || createData.remarks,
        vendorId: response.vendorId || createData.vendorId,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
        imageUrls: response.imageUrls || createData.imageUrls || []
      };

      setListings(prev => [...prev, createdListing]);
      toast.success(MESSAGES.SUCCESS.LISTING_CREATED);
      return true;

    } catch (err) {
      console.error('Failed to create listing:', err);
      toast.error('Failed to create listing. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [vendor, setListings]);

  const handleUpdateListing = useCallback(async (listing: Listing, updateData: Partial<CreateListingDto>): Promise<boolean> => {
    if (!updateData.listingName?.trim() ||
        updateData.listingName.trim().length < VALIDATION_RULES.LISTING_NAME.MIN_LENGTH ||
        !updateData.price ||
        updateData.price < VALIDATION_RULES.PRICE.MIN) {
      toast.error(MESSAGES.ERROR.VALIDATION_FAILED);
      return false;
    }

    if (!listing.id) {
      toast.error(MESSAGES.ERROR.INVALID_LISTING_ID);
      console.error('Attempted to update listing without valid ID:', listing);
      return false;
    }

    try {
      setIsSubmitting(true);
      const updatePayload: UpdateListingDto = {
        listingName: updateData.listingName.trim(),
        price: Number(updateData.price),
        availabilities: updateData.availabilities || [],
        remarks: updateData.remarks?.trim() || "",
        imageUrls: (updateData as any).imageUrls || []
      };

      console.log('Updating listing with ID:', listing.id, 'and data:', updatePayload);
      await ListingsService.listingControllerUpdate(listing.vendorId, listing.id, updatePayload);

      // Update the listing in the list
      setListings(prev => prev.map(item =>
        item.id === listing.id
          ? { ...item, ...updatePayload, updatedAt: new Date().toISOString() }
          : item
      ));

      toast.success(MESSAGES.SUCCESS.LISTING_UPDATED);
      return true;

    } catch (err) {
      console.error('Failed to update listing:', err);
      toast.error('Failed to update listing. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [setListings]);

  const handleDeleteListing = useCallback(async (id: number): Promise<void> => {
    if (!vendor?.id) {
      toast.error(MESSAGES.ERROR.VENDOR_UNAVAILABLE);
      return;
    }

    try {
      await ListingsService.listingControllerDelete(vendor.id, id);
      setListings(prev => prev.filter(listing => listing.id !== id));
      toast.success(MESSAGES.SUCCESS.LISTING_DELETED);
    } catch (err) {
      console.error('Failed to delete listing:', err);
      toast.error('Failed to delete listing. Please try again.');
    }
  }, [vendor, setListings]);

  return {
    handleAddListing,
    handleUpdateListing,
    handleDeleteListing,
    isSubmitting
  };
}