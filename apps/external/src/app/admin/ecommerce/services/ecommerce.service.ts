import {
  ListingResponseDto,
  ListingsService,
  VendorResponseDto,
  VendorsService,
  WeddingService
} from '@shared/api';

export interface ListingsByCategory {
  [key: string]: ListingResponseDto[];
}

export class EcommerceService {
  static async fetchListingsForCategory(category: WeddingService): Promise<ListingResponseDto[]> {
    try {
      let result: ListingResponseDto[] = [];

      switch (category) {
        case WeddingService.VENUE:
          result = await ListingsService.listingControllerGetAllVenues();
          break;
        case WeddingService.CATERING:
          result = await ListingsService.listingControllerGetAllCatering();
          break;
        case WeddingService.PHOTOGRAPHY:
          result = await ListingsService.listingControllerGetAllPhotography();
          break;
        case WeddingService.DECORATION:
          result = await ListingsService.listingControllerGetAllDecoration();
          break;
        case WeddingService.MUSIC:
          result = await ListingsService.listingControllerGetAllMusic();
          break;
        case WeddingService.ATTIRE:
          result = await ListingsService.listingControllerGetAllAttire();
          break;
        case WeddingService.MAKEUP:
          result = await ListingsService.listingControllerGetAllMakeup();
          break;
        case WeddingService.TRANSPORTATION:
          result = await ListingsService.listingControllerGetAllTransportation();
          break;
        default:
          result = [];
      }

      return result;
    } catch (error) {
      console.error(`Error fetching listings for ${category}:`, error);
      throw error;
    }
  }

  static async fetchAllVendors(): Promise<VendorResponseDto[]> {
    try {
      return await VendorsService.vendorControllerGetAllVendors();
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }

  static async fetchAllEcommerceData(categories: WeddingService[]): Promise<{
    vendors: VendorResponseDto[];
    listings: ListingsByCategory;
  }> {
    const [vendorsResult, ...listingResults] = await Promise.all([
      this.fetchAllVendors(),
      ...categories.map(category => this.fetchListingsForCategory(category))
    ]);

    const listingsByCategory: ListingsByCategory = {};
    categories.forEach((category, index) => {
      listingsByCategory[category] = listingResults[index] || [];
    });

    return {
      vendors: vendorsResult,
      listings: listingsByCategory
    };
  }
}