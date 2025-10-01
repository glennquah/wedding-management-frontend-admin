/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilityCheckDto } from '../models/AvailabilityCheckDto';
import type { AvailabilityCheckResponseDto } from '../models/AvailabilityCheckResponseDto';
import type { CalendarConnectionStatusDto } from '../models/CalendarConnectionStatusDto';
import type { RequestCalendarAccessDto } from '../models/RequestCalendarAccessDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CalendarService {
    /**
     * Request calendar access from a collaborator
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
                404: `Wedding or collaborator not found`,
            },
        });
    }
    /**
     * Get Google OAuth authorization URL for a specific admin
     * @param adminId
     * @returns any Authorization URL generated
     * @throws ApiError
     */
    public static calendarControllerGetAuthUrl(
        adminId: number,
    ): CancelablePromise<{
        authUrl?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/oauth/authorize/{adminId}',
            path: {
                'adminId': adminId,
            },
        });
    }
    /**
     * Handle Google OAuth callback
     * @param code Authorization code from Google
     * @param state State parameter containing adminId
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
     * Check calendar connection status for an admin
     * @param adminId
     * @returns CalendarConnectionStatusDto Calendar connection status
     * @throws ApiError
     */
    public static calendarControllerGetConnectionStatus(
        adminId: number,
    ): CancelablePromise<CalendarConnectionStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/connection-status/{adminId}',
            path: {
                'adminId': adminId,
            },
        });
    }
    /**
     * Check availability for multiple collaborators
     * @param requestBody
     * @returns AvailabilityCheckResponseDto Availability data for collaborators
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
}
