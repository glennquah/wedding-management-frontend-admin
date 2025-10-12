/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGratitudeCardDto } from '../models/CreateGratitudeCardDto';
import type { GratitudeCardResponseDto } from '../models/GratitudeCardResponseDto';
import type { UpdateGratitudeCardDto } from '../models/UpdateGratitudeCardDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GratitudeCardService {
    /**
     * Get gratitude card by wedding ID
     * @param weddingId
     * @returns GratitudeCardResponseDto Gratitude card retrieved successfully.
     * @throws ApiError
     */
    public static gratitudeCardControllerGetGratitudeCardByWeddingId(
        weddingId: number,
    ): CancelablePromise<GratitudeCardResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gratitude-card/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Gratitude card not found.`,
            },
        });
    }
    /**
     * Get gratitude card by card ID
     * @param id
     * @returns GratitudeCardResponseDto Gratitude card retrieved successfully.
     * @throws ApiError
     */
    public static gratitudeCardControllerGetGratitudeCardById(
        id: number,
    ): CancelablePromise<GratitudeCardResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gratitude-card/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Gratitude card not found.`,
            },
        });
    }
    /**
     * Update gratitude card message and photo for a specific recipient type (guest, collab, vendor)
     * @param id
     * @param requestBody
     * @returns GratitudeCardResponseDto Gratitude card updated successfully.
     * @throws ApiError
     */
    public static gratitudeCardControllerUpdateGratitudeCard(
        id: number,
        requestBody: UpdateGratitudeCardDto,
    ): CancelablePromise<GratitudeCardResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/gratitude-card/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Gratitude card not found or not owned by admin.`,
            },
        });
    }
    /**
     * Delete a gratitude card by ID
     * @param id
     * @returns any Gratitude card deleted successfully.
     * @throws ApiError
     */
    public static gratitudeCardControllerDeleteGratitudeCard(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gratitude-card/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Gratitude card not found or not owned by admin.`,
            },
        });
    }
    /**
     * Create guest gratitude card for a wedding
     * @param requestBody
     * @returns GratitudeCardResponseDto Guest gratitude card created successfully.
     * @throws ApiError
     */
    public static gratitudeCardControllerCreateGuestGratitudeCard(
        requestBody: CreateGratitudeCardDto,
    ): CancelablePromise<GratitudeCardResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gratitude-card/guest',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - not wedding admin.`,
                404: `Admin or wedding not found.`,
                409: `Wedding already has a gratitude card.`,
            },
        });
    }
}
