/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuestCountResponseDto } from '../models/GuestCountResponseDto';
import type { RsvpCountResponseDto } from '../models/RsvpCountResponseDto';
import type { SpendingResponseDto } from '../models/SpendingResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Get guest count for a wedding
     * Returns the total number of guests, primary guests, and accompanying guests for a specific wedding.
     * @param weddingId
     * @returns GuestCountResponseDto Guest count retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetGuestCount(
        weddingId: number,
    ): CancelablePromise<GuestCountResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/guest-count/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found`,
            },
        });
    }
    /**
     * Get spending analytics for a wedding
     * Returns total spending from orders, allocated budget, current spending, remaining budget, and budget usage percentage.
     * @param weddingId
     * @returns SpendingResponseDto Spending analytics retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetSpending(
        weddingId: number,
    ): CancelablePromise<SpendingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/spending/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found`,
            },
        });
    }
    /**
     * Get RSVP count for a wedding
     * Returns the number of guests who have confirmed attendance, pending RSVPs, and RSVP percentage.
     * @param weddingId
     * @returns RsvpCountResponseDto RSVP count retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetRsvpCount(
        weddingId: number,
    ): CancelablePromise<RsvpCountResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/rsvp-count/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found`,
            },
        });
    }
}
