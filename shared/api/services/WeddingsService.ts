/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWeddingDto } from '../models/CreateWeddingDto';
import type { UpdateWeddingDto } from '../models/UpdateWeddingDto';
import type { WeddingResponseDto } from '../models/WeddingResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WeddingsService {
    /**
     * Create a new wedding
     * @param requestBody
     * @returns WeddingResponseDto The wedding has been successfully created.
     * @throws ApiError
     */
    public static weddingControllerCreate(
        requestBody: CreateWeddingDto,
    ): CancelablePromise<WeddingResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/weddings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get all weddings
     * @returns WeddingResponseDto List of all weddings
     * @throws ApiError
     */
    public static weddingControllerFindAll(): CancelablePromise<Array<WeddingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings',
        });
    }
    /**
     * Get weddings associated with the logged-in admin
     * @returns WeddingResponseDto List of weddings associated with the admin
     * @throws ApiError
     */
    public static weddingControllerGetAdminWeddings(): CancelablePromise<Array<WeddingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/admin/my-weddings',
        });
    }
    /**
     * Get a wedding by ID
     * @param id
     * @returns WeddingResponseDto The wedding details
     * @throws ApiError
     */
    public static weddingControllerFindOne(
        id: number,
    ): CancelablePromise<WeddingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Update a wedding
     * @param id
     * @param requestBody
     * @returns WeddingResponseDto The wedding has been successfully updated.
     * @throws ApiError
     */
    public static weddingControllerUpdate(
        id: number,
        requestBody: UpdateWeddingDto,
    ): CancelablePromise<WeddingResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/weddings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Delete a wedding
     * @param id
     * @returns any The wedding has been successfully deleted.
     * @throws ApiError
     */
    public static weddingControllerRemove(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/weddings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
}
