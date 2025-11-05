import { FilterOptions } from '../types';

// Default filter options
export const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  priceRange: {
    min: null,
    max: null,
  },
  sortBy: 'name',
  sortOrder: 'asc',
};

// Form validation constraints
export const VALIDATION_RULES = {
  LISTING_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PRICE: {
    MIN: 0.01,
    MAX: 999999.99,
  },
  REMARKS: {
    MAX_LENGTH: 500,
  },
} as const;

// UI Messages
export const MESSAGES = {
  LOADING: 'Loading your listings...',
  ERROR: {
    VENDOR_NOT_FOUND: 'Vendor profile not found',
    FAILED_TO_LOAD: 'Failed to load vendor information',
    INVALID_LISTING_ID: 'Cannot update listing: Invalid listing ID. Please refresh the page and try again.',
    VALIDATION_FAILED: 'Please provide a valid listing name and price',
    VENDOR_UNAVAILABLE: 'Vendor information not available',
    LISTING_HAS_ORDERS: 'Cannot delete listing: This listing has active orders associated with it. Please cancel or complete all orders before deleting.',
  },
  SUCCESS: {
    LISTING_CREATED: 'Listing created successfully!',
    LISTING_UPDATED: 'Listing updated successfully!',
    LISTING_DELETED: 'Listing deleted successfully!',
  },
  EMPTY_STATES: {
    NO_LISTINGS: {
      TITLE: 'No listings to display',
      DESCRIPTION: 'Create your first service listing to see it here as a card',
    },
    NO_FILTERED_RESULTS: {
      TITLE: 'No listings match your filters',
      DESCRIPTION: 'Try adjusting your search criteria or clear the filters',
    },
  },
} as const;

// Sort options for the filter component
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'price', label: 'Price' },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;