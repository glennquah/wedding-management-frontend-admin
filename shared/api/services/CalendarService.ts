/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilityCheckDto } from '../models/AvailabilityCheckDto';
import type { AvailabilityCheckResponseDto } from '../models/AvailabilityCheckResponseDto';
import type { CalendarConnectionStatusDto } from '../models/CalendarConnectionStatusDto';
import type { OptimizeDateRequestDto } from '../models/OptimizeDateRequestDto';
import type { OptimizeDateResponseDto } from '../models/OptimizeDateResponseDto';
import type { RequestCalendarAccessDto } from '../models/RequestCalendarAccessDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CalendarService {
    /**
     * Request calendar access from an admin or guest
     * @param requestBody
     * @returns any Calendar access request sent successfully
     * @throws ApiError
     */
    public static calendarControllerRequestCalendarAccess(
        requestBody: RequestCalendarAccessDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendar/request-access',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Wedding or user not found`,
            },
        });
    }
    /**
     * Get Google OAuth authorization URL for a user (admin or guest)
     * @param userId
     * @param isAdmin Whether the user is an admin (true) or guest (false)
     * @param returnUrl URL path to redirect to after OAuth callback (e.g., /admin/date-optimizer)
     * @returns any Authorization URL generated
     * @throws ApiError
     */
    public static calendarControllerGetAuthUrl(
        userId: number,
        isAdmin?: boolean,
        returnUrl?: string,
    ): CancelablePromise<{
        authUrl?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/oauth/authorize/{userId}',
            path: {
                'userId': userId,
            },
            query: {
                'isAdmin': isAdmin,
                'returnUrl': returnUrl,
            },
        });
    }
    /**
     * Handle Google OAuth callback
     * @param code Authorization code from Google
     * @param state State parameter containing userId and isAdmin flag
     * @returns void
     * @throws ApiError
     */
    public static calendarControllerHandleOAuthCallback(
        code: string,
        state: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/oauth/callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                302: `Redirects to success page`,
            },
        });
    }
    /**
     * Check calendar connection status for an admin or guest
     * @param userId
     * @param isAdmin Whether the user is an admin (true) or guest (false)
     * @returns CalendarConnectionStatusDto Calendar connection status
     * @throws ApiError
     */
    public static calendarControllerGetConnectionStatus(
        userId: number,
        isAdmin?: boolean,
    ): CancelablePromise<CalendarConnectionStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/connection-status/{userId}',
            path: {
                'userId': userId,
            },
            query: {
                'isAdmin': isAdmin,
            },
        });
    }
    /**
     * Check availability for multiple users (admins and guests)
     * @param requestBody
     * @returns AvailabilityCheckResponseDto Availability data for users
     * @throws ApiError
     */
    public static calendarControllerCheckAvailability(
        requestBody: AvailabilityCheckDto,
    ): CancelablePromise<AvailabilityCheckResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendar/check-availability',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Disconnect calendar for the authenticated admin
     * @returns any Calendar disconnected successfully
     * @throws ApiError
     */
    public static calendarControllerDisconnectCalendar(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/calendar/disconnect',
        });
    }
    /**
     * Disconnect calendar for a specific user (guest or admin)
     * @param userId
     * @param isAdmin Whether the user is an admin (true) or guest (false)
     * @returns any Calendar disconnected successfully
     * @throws ApiError
     */
    public static calendarControllerDisconnectUserCalendar(
        userId: number,
        isAdmin?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/calendar/disconnect/{userId}',
            path: {
                'userId': userId,
            },
            query: {
                'isAdmin': isAdmin,
            },
        });
    }
    /**
     * Optimize wedding date using AI-powered scheduling algorithm
     * @param requestBody
     * @returns OptimizeDateResponseDto Date optimization results
     * @throws ApiError
     */
    public static calendarControllerOptimizeWeddingDate(
        requestBody: OptimizeDateRequestDto,
    ): CancelablePromise<OptimizeDateResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendar/optimize-date',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
