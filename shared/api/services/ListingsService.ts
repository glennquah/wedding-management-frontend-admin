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
}
