/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateListingDto } from '../models/CreateListingDto';
import type { UpdateListingDto } from '../models/UpdateListingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ListingsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static listingControllerCreate(
        requestBody: CreateListingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/listings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param vendorId
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static listingControllerUpdate(
        vendorId: number,
        id: number,
        requestBody: UpdateListingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/listings/{vendorId}/{id}',
            path: {
                'vendorId': vendorId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param vendorId
     * @param id
     * @returns any
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
        });
    }
    /**
     * @param vendorId
     * @param listingName
     * @returns any
     * @throws ApiError
     */
    public static listingControllerSearch(
        vendorId: number,
        listingName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/listings/{vendorId}/search',
            path: {
                'vendorId': vendorId,
            },
            query: {
                'listingName': listingName,
            },
        });
    }
}
