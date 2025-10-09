/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGiftDto } from '../models/CreateGiftDto';
import type { GiftResponseDto } from '../models/GiftResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GiftsService {
    /**
     * Create a new gift record for a wedding
     * @param requestBody
     * @returns GiftResponseDto The gift record has been successfully created.
     * @throws ApiError
     */
    public static giftControllerCreate(
        requestBody: CreateGiftDto,
    ): CancelablePromise<GiftResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gifts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get all gifts for a specific wedding
     * @param weddingId
     * @returns GiftResponseDto List of gifts for the wedding
     * @throws ApiError
     */
    public static giftControllerGetGiftsByWedding(
        weddingId: number,
    ): CancelablePromise<Array<GiftResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gifts/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get a gift by ID
     * @param id
     * @returns GiftResponseDto The gift details
     * @throws ApiError
     */
    public static giftControllerGetGift(
        id: number,
    ): CancelablePromise<GiftResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gifts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Gift not found.`,
            },
        });
    }
    /**
     * Delete a gift record
     * @param id
     * @returns any The gift record has been successfully deleted.
     * @throws ApiError
     */
    public static giftControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gifts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Gift not found.`,
            },
        });
    }
}
