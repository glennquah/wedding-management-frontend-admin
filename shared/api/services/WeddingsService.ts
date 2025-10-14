/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWeddingDto } from '../models/CreateWeddingDto';
import type { DateOptimizerPreferencesDto } from '../models/DateOptimizerPreferencesDto';
import type { SetWeddingDateDto } from '../models/SetWeddingDateDto';
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
    /**
     * Add a key attendee for date optimization
     * @param id
     * @param adminId
     * @returns any Key attendee added successfully
     * @throws ApiError
     */
    public static weddingControllerAddKeyAttendee(
        id: number,
        adminId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/weddings/{id}/key-attendees/{adminId}',
            path: {
                'id': id,
                'adminId': adminId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Remove a key attendee
     * @param id
     * @param adminId
     * @returns any Key attendee removed successfully
     * @throws ApiError
     */
    public static weddingControllerRemoveKeyAttendee(
        id: number,
        adminId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/weddings/{id}/key-attendees/{adminId}',
            path: {
                'id': id,
                'adminId': adminId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get all key attendees for a wedding
     * @param id
     * @returns any List of key attendee IDs
     * @throws ApiError
     */
    public static weddingControllerGetKeyAttendees(
        id: number,
    ): CancelablePromise<{
        keyAttendeeIds?: Array<number>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/{id}/key-attendees',
            path: {
                'id': id,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get main couple for a wedding
     * @param id
     * @returns any Main couple members
     * @throws ApiError
     */
    public static weddingControllerGetMainCouple(
        id: number,
    ): CancelablePromise<Array<{
        id?: number;
        name?: string;
        email?: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/{id}/main-couple',
            path: {
                'id': id,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Update date optimizer preferences for a wedding
     * @param id
     * @param requestBody
     * @returns any Date optimizer preferences updated successfully
     * @throws ApiError
     */
    public static weddingControllerUpdateDateOptimizerPreferences(
        id: number,
        requestBody: DateOptimizerPreferencesDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/weddings/{id}/date-optimizer-preferences',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get date optimizer preferences for a wedding
     * @param id
     * @returns DateOptimizerPreferencesDto Date optimizer preferences
     * @throws ApiError
     */
    public static weddingControllerGetDateOptimizerPreferences(
        id: number,
    ): CancelablePromise<DateOptimizerPreferencesDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weddings/{id}/date-optimizer-preferences',
            path: {
                'id': id,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Set the official wedding date
     * @param id
     * @param requestBody
     * @returns WeddingResponseDto Wedding date updated successfully.
     * @throws ApiError
     */
    public static weddingControllerSetWeddingDate(
        id: number,
        requestBody: SetWeddingDateDto,
    ): CancelablePromise<WeddingResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/weddings/{id}/date',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
}
