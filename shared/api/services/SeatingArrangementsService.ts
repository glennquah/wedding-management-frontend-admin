/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSeatingArrangementDto } from '../models/CreateSeatingArrangementDto';
import type { HallLayoutDto } from '../models/HallLayoutDto';
import type { SeatingArrangementResponseDto } from '../models/SeatingArrangementResponseDto';
import type { SeatingRequestDto } from '../models/SeatingRequestDto';
import type { SeatingResultDto } from '../models/SeatingResultDto';
import type { UpdateSeatingArrangementDto } from '../models/UpdateSeatingArrangementDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SeatingArrangementsService {
    /**
     * Create seating arrangement for a wedding
     * @param weddingId Wedding ID
     * @param requestBody
     * @returns SeatingArrangementResponseDto Seating arrangement created successfully.
     * @throws ApiError
     */
    public static seatingArrangementControllerCreate(
        weddingId: number,
        requestBody: CreateSeatingArrangementDto,
    ): CancelablePromise<SeatingArrangementResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/weddings/{weddingId}/seating-arrangement',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Wedding not found.`,
                409: `Seating arrangement already exists.`,
            },
        });
    }
    /**
     * Get seating arrangement for a wedding
     * @param weddingId Wedding ID
     * @returns SeatingArrangementResponseDto Seating arrangement found.
     * @throws ApiError
     */
    public static seatingArrangementControllerFindOne(
        weddingId: number,
    ): CancelablePromise<SeatingArrangementResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/{weddingId}/seating-arrangement',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Seating arrangement not found.`,
            },
        });
    }
    /**
     * Update seating arrangement for a wedding
     * @param weddingId Wedding ID
     * @param requestBody
     * @returns SeatingArrangementResponseDto Seating arrangement updated successfully.
     * @throws ApiError
     */
    public static seatingArrangementControllerUpdate(
        weddingId: number,
        requestBody: UpdateSeatingArrangementDto,
    ): CancelablePromise<SeatingArrangementResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/weddings/{weddingId}/seating-arrangement',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Seating arrangement not found.`,
            },
        });
    }
    /**
     * Delete seating arrangement for a wedding
     * @param weddingId Wedding ID
     * @returns void
     * @throws ApiError
     */
    public static seatingArrangementControllerRemove(
        weddingId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/weddings/{weddingId}/seating-arrangement',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Seating arrangement not found.`,
            },
        });
    }
    /**
     * Get hall layout for guest count bucket
     * @param weddingId Wedding ID
     * @param guestCountBucket Guest count bucket (e.g., SMALL, MEDIUM, LARGE)
     * @param tablesPerRow Number of tables per row for layout selection (optional)
     * @returns HallLayoutDto Hall layout retrieved successfully.
     * @throws ApiError
     */
    public static seatingArrangementControllerGetHallLayout(
        weddingId: number,
        guestCountBucket: string,
        tablesPerRow?: number,
    ): CancelablePromise<HallLayoutDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/{weddingId}/seating-arrangement/layout/{guestCountBucket}',
            path: {
                'weddingId': weddingId,
                'guestCountBucket': guestCountBucket,
            },
            query: {
                'tables_per_row': tablesPerRow,
            },
            errors: {
                404: `Hall layout not found for the specified bucket.`,
            },
        });
    }
    /**
     * Optimize seating arrangement
     * @param weddingId Wedding ID
     * @param requestBody
     * @returns SeatingResultDto Seating optimization completed successfully.
     * @throws ApiError
     */
    public static seatingArrangementControllerOptimizeSeating(
        weddingId: number,
        requestBody: SeatingRequestDto,
    ): CancelablePromise<SeatingResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/weddings/{weddingId}/seating-arrangement/optimize',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid seating request data.`,
            },
        });
    }
}
