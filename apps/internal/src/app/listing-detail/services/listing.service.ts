import {
  ListingResponseDto,
  VendorResponseDto,
  ListingsService,
  VendorsService
} from '@wedding/api-types';

export class ListingService {
  static async fetchListingById(id: number): Promise<ListingResponseDto> {
    try {
      return await ListingsService.listingControllerFindById(id);
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }

  static async fetchVendorById(vendorId: number): Promise<VendorResponseDto> {
    try {
      return await VendorsService.vendorControllerGetVendor(vendorId);
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }

  static async fetchListingWithVendor(listingId: number): Promise<{
    listing: ListingResponseDto;
    vendor: VendorResponseDto | null;
  }> {
    const listing = await this.fetchListingById(listingId);

    let vendor: VendorResponseDto | null = null;
    if (listing.vendorId) {
      vendor = await this.fetchVendorById(listing.vendorId);
    }

    return { listing, vendor };
  }
}
