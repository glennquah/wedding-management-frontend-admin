/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGuestDto } from '../models/CreateGuestDto';
import type { GuestResponseDto } from '../models/GuestResponseDto';
import type { UpdateGuestDto } from '../models/UpdateGuestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GuestsService {
    /**
     * Create a new guest
     * @param requestBody
     * @returns GuestResponseDto The guest has been successfully created.
     * @throws ApiError
     */
    public static guestControllerCreate(
        requestBody: CreateGuestDto,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get all guests for all weddings
     * @returns GuestResponseDto List of guests for all weddings
     * @throws ApiError
     */
    public static guestControllerGetAllGuests(): CancelablePromise<Array<GuestResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests',
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Create multiple guests
     * @param requestBody
     * @returns GuestResponseDto The guests have been successfully created.
     * @throws ApiError
     */
    public static guestControllerCreateMultiple(
        requestBody: Array<string>,
    ): CancelablePromise<Array<GuestResponseDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guests/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get all guests for a specific wedding
     * @param weddingId
     * @returns GuestResponseDto List of guests for the wedding
     * @throws ApiError
     */
    public static guestControllerGetGuestsByWedding(
        weddingId: number,
    ): CancelablePromise<Array<GuestResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Delete all guests for a specific wedding
     * @param weddingId
     * @returns any All guests for the wedding have been successfully deleted.
     * @throws ApiError
     */
    public static guestControllerDeleteGuestsByWedding(
        weddingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/guests/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get a guest by ID
     * @param id
     * @returns GuestResponseDto The guest details
     * @throws ApiError
     */
    public static guestControllerGetGuest(
        id: number,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Guest not found.`,
            },
        });
    }
    /**
     * Update a guest
     * @param id
     * @param requestBody
     * @returns GuestResponseDto The guest has been successfully updated.
     * @throws ApiError
     */
    public static guestControllerUpdate(
        id: number,
        requestBody: UpdateGuestDto,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/guests/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Guest not found.`,
            },
        });
    }
    /**
     * Delete a guest
     * @param id
     * @returns any The guest has been successfully deleted.
     * @throws ApiError
     */
    public static guestControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/guests/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Guest not found.`,
            },
        });
    }
    /**
     * Confirm guest attendance
     * @param id
     * @returns GuestResponseDto The guest confirmation has been updated.
     * @throws ApiError
     */
    public static guestControllerConfirmGuest(
        id: number,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/guests/{id}/confirm',
            path: {
                'id': id,
            },
            errors: {
                404: `Guest not found.`,
            },
        });
    }
    /**
     * Reject guest attendance
     * @param id
     * @returns GuestResponseDto The guest confirmation has been updated.
     * @throws ApiError
     */
    public static guestControllerRejectGuest(
        id: number,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/guests/{id}/reject',
            path: {
                'id': id,
            },
            errors: {
                404: `Guest not found.`,
            },
        });
    }
    /**
     * Toggle guest attendance status
     * @param id
     * @returns GuestResponseDto The guest attendance has been toggled.
     * @throws ApiError
     */
    public static guestControllerMarkAttendance(
        id: number,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/guests/{id}/mark-attendance',
            path: {
                'id': id,
            },
            errors: {
                404: `Guest not found.`,
            },
        });
    }
}
