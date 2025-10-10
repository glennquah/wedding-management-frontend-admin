import { ListingResponseDto, VendorResponseDto, WeddingService, AvailabilitySlotDto } from '@shared/api';

export interface ListingsByCategory {
  [key: string]: ListingResponseDto[];
}

export interface EcommercePageProps {
  listings: ListingsByCategory;
  vendors: VendorResponseDto[];
  loading?: boolean;
  error?: string | null;
}

export interface LoadingStateProps {
  categories: WeddingService[];
}

export interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export interface HeaderProps {
  totalListings: number;
  vendorCount: number;
  categoryCount: number;
}

export interface EmptyStateProps {
  loading?: boolean;
  totalListings?: number;
}

export interface ListingDetailProps {
  listing: ListingResponseDto;
  vendor: VendorResponseDto | null;
}

export interface ImageGalleryProps {
  imageUrls?: string[];
  listingName: string;
}

export interface ListingHeaderProps {
  listing: ListingResponseDto;
  vendor: VendorResponseDto | null;
  formatPrice: (price: number) => string;
}

export interface DescriptionCardProps {
  remarks?: string;
}

export interface AvailabilityCardProps {
  availabilities: AvailabilitySlotDto[];
  currentPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  itemsPerPage: number;
  selectedSlots?: AvailabilitySlotDto[];
  onSlotToggle?: (slot: AvailabilitySlotDto) => void;
  slotsInCart?: AvailabilitySlotDto[];
}

export interface VendorCardProps {
  vendor: VendorResponseDto;
}

export interface BackButtonProps {
  onBack: () => void;
  label?: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentItems: unknown[];
}