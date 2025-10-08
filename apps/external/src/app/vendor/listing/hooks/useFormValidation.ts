import { useMemo } from 'react';
import { CreateListingDto } from '@shared/api';
import { VALIDATION_RULES } from '../constants';

export interface ValidationError {
  field: keyof CreateListingDto;
  message: string;
}

export interface UseFormValidationReturn {
  errors: ValidationError[];
  isValid: boolean;
  getFieldError: (field: keyof CreateListingDto) => string | undefined;
  hasFieldError: (field: keyof CreateListingDto) => boolean;
}

export function useFormValidation(formData: Partial<CreateListingDto>): UseFormValidationReturn {
  const errors = useMemo(() => {
    const validationErrors: ValidationError[] = [];

    // Validate listing name
    if (!formData.listingName?.trim()) {
      validationErrors.push({
        field: 'listingName',
        message: 'Listing name is required'
      });
    } else if (formData.listingName.trim().length < VALIDATION_RULES.LISTING_NAME.MIN_LENGTH) {
      validationErrors.push({
        field: 'listingName',
        message: `Listing name must be at least ${VALIDATION_RULES.LISTING_NAME.MIN_LENGTH} characters`
      });
    } else if (formData.listingName.trim().length > VALIDATION_RULES.LISTING_NAME.MAX_LENGTH) {
      validationErrors.push({
        field: 'listingName',
        message: `Listing name must not exceed ${VALIDATION_RULES.LISTING_NAME.MAX_LENGTH} characters`
      });
    }

    // Validate price
    if (formData.price === undefined || formData.price === null) {
      validationErrors.push({
        field: 'price',
        message: 'Price is required'
      });
    } else if (formData.price < VALIDATION_RULES.PRICE.MIN) {
      validationErrors.push({
        field: 'price',
        message: `Price must be at least $${VALIDATION_RULES.PRICE.MIN}`
      });
    } else if (formData.price > VALIDATION_RULES.PRICE.MAX) {
      validationErrors.push({
        field: 'price',
        message: `Price must not exceed $${VALIDATION_RULES.PRICE.MAX.toLocaleString()}`
      });
    }

    // Validate remarks (optional field)
    if (formData.remarks && formData.remarks.length > VALIDATION_RULES.REMARKS.MAX_LENGTH) {
      validationErrors.push({
        field: 'remarks',
        message: `Remarks must not exceed ${VALIDATION_RULES.REMARKS.MAX_LENGTH} characters`
      });
    }

    // Validate vendor ID
    if (!formData.vendorId || formData.vendorId <= 0) {
      validationErrors.push({
        field: 'vendorId',
        message: 'Valid vendor information is required'
      });
    }

    return validationErrors;
  }, [formData]);

  const isValid = errors.length === 0;

  const getFieldError = (field: keyof CreateListingDto): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const hasFieldError = (field: keyof CreateListingDto): boolean => {
    return errors.some(error => error.field === field);
  };

  return {
    errors,
    isValid,
    getFieldError,
    hasFieldError,
  };
}