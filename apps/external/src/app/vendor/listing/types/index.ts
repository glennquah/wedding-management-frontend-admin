import { CreateListingDto, AvailabilitySlotDto } from '@shared/api';

export interface Listing {
  id: number;
  listingName: string;
  price: number;
  availabilities: AvailabilitySlotDto[];
  remarks: string;
  vendorId: number;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
}

export interface FilterOptions {
  searchQuery: string;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  sortBy: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

export interface ListingFormData extends Partial<CreateListingDto> {
  listingName: string;
  price: number;
  availabilities: AvailabilitySlotDto[];
  remarks: string;
  vendorId: number;
}

export interface UseListingDataReturn {
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  vendor: import('@shared/api').VendorResponseDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseListingFormReturn {
  isAddingListing: boolean;
  editingListing: Listing | null;
  formData: Partial<CreateListingDto> & { imageUrls?: string[] };
  isFormOpen: boolean;
  openAddForm: () => void;
  openEditForm: (listing: Listing) => void;
  closeForm: () => void;
  updateFormData: (updates: Partial<CreateListingDto> & { imageUrls?: string[] }) => void;
  resetForm: () => void;
}

export interface UseListingOperationsReturn {
  handleAddListing: (listingData: Partial<CreateListingDto>) => Promise<boolean>;
  handleUpdateListing: (listing: Listing, updateData: Partial<CreateListingDto>) => Promise<boolean>;
  handleDeleteListing: (id: number) => Promise<void>;
  isSubmitting: boolean;
}

export interface UseListingFiltersReturn {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  clearFilters: () => void;
  filteredListings: Listing[];
  updateFilter: (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => void;
}