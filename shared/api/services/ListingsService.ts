/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateListingDto } from '../models/CreateListingDto';
import type { ListingResponseDto } from '../models/ListingResponseDto';
import type { UpdateListingDto } from '../models/UpdateListingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ListingsService {
    /**
     * Create a new listing
     * @param requestBody
     * @returns ListingResponseDto The listing has been successfully created.
     * @throws ApiError
     */
    public static listingControllerCreate(
        requestBody: CreateListingDto,
    ): CancelablePromise<ListingResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/listings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Update a listing
     * @param vendorId
     * @param id
     * @param requestBody
     * @returns ListingResponseDto The listing has been successfully updated.
     * @throws ApiError
     */
    public static listingControllerUpdate(
        vendorId: number,
        id: number,
        requestBody: UpdateListingDto,
    ): CancelablePromise<ListingResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/listings/{vendorId}/{id}',
            path: {
                'vendorId': vendorId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Listing not found.`,
            },
        });
    }
    /**
     * Delete a listing
     * @param vendorId
     * @param id
     * @returns any The listing has been successfully deleted.
     * @throws ApiError
     */
    public static listingControllerDelete(
        vendorId: number,
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/listings/{vendorId}/{id}',
            path: {
                'vendorId': vendorId,
                'id': id,
            },
            errors: {
                404: `Listing not found.`,
            },
        });
    }
    /**
     * Get a listing by ID
     * @param id
     * @returns ListingResponseDto The listing details.
     * @throws ApiError
     */
    public static listingControllerFindById(
        id: number,
    ): CancelablePromise<ListingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Listing not found.`,
            },
        });
    }
    /**
     * Search listings by vendor name
     * @param vendorId
     * @param listingName
     * @returns ListingResponseDto The listing search results.
     * @throws ApiError
     */
    public static listingControllerSearch(
        vendorId: number,
        listingName: string,
    ): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/{vendorId}/search',
            path: {
                'vendorId': vendorId,
            },
            query: {
                'listingName': listingName,
            },
            errors: {
                404: `Vendor not found.`,
            },
        });
    }
    /**
     * Get all venue listings
     * @returns ListingResponseDto All venue listings.
     * @throws ApiError
     */
    public static listingControllerGetAllVenues(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/venue/all',
        });
    }
    /**
     * Browse venue listings with filtering
     * @param minPrice
     * @param maxPrice
     * @param availableDate
     * @param style
     * @param weddingType
     * @param minRating
     * @param minCapacity
     * @param search
     * @param sortBy
     * @param sortOrder
     * @param limit
     * @param offset
     * @returns any Filtered venue listings with pagination.
     * @throws ApiError
     */
    public static listingControllerBrowseVenues(
        minPrice: number,
        maxPrice: number,
        availableDate: string,
        style: string,
        weddingType: string,
        minRating: number,
        minCapacity: number,
        search: string,
        sortBy: string,
        sortOrder: string,
        limit: number,
        offset: number,
    ): CancelablePromise<{
        listings?: Array<ListingResponseDto>;
        total?: number;
        page?: number;
        totalPages?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/venue/browse',
            query: {
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'availableDate': availableDate,
                'style': style,
                'weddingType': weddingType,
                'minRating': minRating,
                'minCapacity': minCapacity,
                'search': search,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get all catering listings
     * @returns ListingResponseDto All catering listings.
     * @throws ApiError
     */
    public static listingControllerGetAllCatering(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/catering/all',
        });
    }
    /**
     * Get all photography listings
     * @returns ListingResponseDto All photography listings.
     * @throws ApiError
     */
    public static listingControllerGetAllPhotography(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/photography/all',
        });
    }
    /**
     * Get all decoration listings
     * @returns ListingResponseDto All decoration listings.
     * @throws ApiError
     */
    public static listingControllerGetAllDecoration(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/decoration/all',
        });
    }
    /**
     * Get all music listings
     * @returns ListingResponseDto All music listings.
     * @throws ApiError
     */
    public static listingControllerGetAllMusic(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/music/all',
        });
    }
    /**
     * Get all attire listings
     * @returns ListingResponseDto All attire listings.
     * @throws ApiError
     */
    public static listingControllerGetAllAttire(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/attire/all',
        });
    }
    /**
     * Get all makeup listings
     * @returns ListingResponseDto All makeup listings.
     * @throws ApiError
     */
    public static listingControllerGetAllMakeup(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/makeup/all',
        });
    }
    /**
     * Get all transportation listings
     * @returns ListingResponseDto All transportation listings.
     * @throws ApiError
     */
    public static listingControllerGetAllTransportation(): CancelablePromise<Array<ListingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/transportation/all',
        });
    }
    /**
     * Browse listings with comprehensive filtering
     * @param service
     * @param minPrice
     * @param maxPrice
     * @param availableDate
     * @param style
     * @param weddingType
     * @param minRating
     * @param minCapacity
     * @param search
     * @param sortBy
     * @param sortOrder
     * @param limit
     * @param offset
     * @returns any Filtered listings with pagination.
     * @throws ApiError
     */
    public static listingControllerBrowseListings(
        service: string,
        minPrice: number,
        maxPrice: number,
        availableDate: string,
        style: string,
        weddingType: string,
        minRating: number,
        minCapacity: number,
        search: string,
        sortBy: string,
        sortOrder: string,
        limit: number,
        offset: number,
    ): CancelablePromise<{
        listings?: Array<ListingResponseDto>;
        total?: number;
        page?: number;
        totalPages?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/browse',
            query: {
                'service': service,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'availableDate': availableDate,
                'style': style,
                'weddingType': weddingType,
                'minRating': minRating,
                'minCapacity': minCapacity,
                'search': search,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Advanced search listings with enhanced text search
     * @param search
     * @param service
     * @param minPrice
     * @param maxPrice
     * @param availableDate
     * @param style
     * @param weddingType
     * @param minRating
     * @param minCapacity
     * @param sortBy
     * @param sortOrder
     * @param limit
     * @param offset
     * @returns any Advanced search results with pagination.
     * @throws ApiError
     */
    public static listingControllerSearchListingsAdvanced(
        search: string,
        service: string,
        minPrice: number,
        maxPrice: number,
        availableDate: string,
        style: string,
        weddingType: string,
        minRating: number,
        minCapacity: number,
        sortBy: string,
        sortOrder: string,
        limit: number,
        offset: number,
    ): CancelablePromise<{
        listings?: Array<ListingResponseDto>;
        total?: number;
        page?: number;
        totalPages?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/search/advanced',
            query: {
                'search': search,
                'service': service,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'availableDate': availableDate,
                'style': style,
                'weddingType': weddingType,
                'minRating': minRating,
                'minCapacity': minCapacity,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get cheapest listing for a vendor
     * @param vendorId
     * @returns ListingResponseDto Cheapest listing for the vendor.
     * @throws ApiError
     */
    public static listingControllerGetCheapestListingForVendor(
        vendorId: number,
    ): CancelablePromise<ListingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/vendor/{vendorId}/cheapest',
            path: {
                'vendorId': vendorId,
            },
            errors: {
                404: `Vendor or listings not found.`,
            },
        });
    }
}
