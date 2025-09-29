/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfirmGuestDto } from '../models/ConfirmGuestDto';
import type { CreateMicrositeDto } from '../models/CreateMicrositeDto';
import type { GuestLookupDto } from '../models/GuestLookupDto';
import type { GuestResponseDto } from '../models/GuestResponseDto';
import type { MicrositeLoginDto } from '../models/MicrositeLoginDto';
import type { MicrositeResponseDto } from '../models/MicrositeResponseDto';
import type { UpdateMicrositeDto } from '../models/UpdateMicrositeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MicrositeService {
    /**
     * Get microsite details by slug
     * @param slug Slug of the microsite (e.g., "johnjenny")
     * @returns MicrositeResponseDto Microsite details retrieved successfully
     * @throws ApiError
     */
    public static micrositeControllerGetMicrositeDetails(
        slug: string,
    ): CancelablePromise<MicrositeResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/microsite/details',
            query: {
                'slug': slug,
            },
            errors: {
                404: `Microsite not found.`,
            },
        });
    }
    /**
     * Get microsite details by wedding ID
     * @param weddingId
     * @returns MicrositeResponseDto Microsite details retrieved successfully
     * @throws ApiError
     */
    public static micrositeControllerGetMicrositeByWeddingId(
        weddingId: number,
    ): CancelablePromise<MicrositeResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/microsite/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                401: `Unauthorized.`,
                403: `Forbidden - Admin role required.`,
                404: `Microsite not found for the wedding.`,
            },
        });
    }
    /**
     * Validate microsite password
     * @param requestBody
     * @returns any Password validation successful
     * @throws ApiError
     */
    public static micrositeControllerValidatePassword(
        requestBody: MicrositeLoginDto,
    ): CancelablePromise<{
        isValid?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/microsite/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid password.`,
                404: `Microsite not found.`,
            },
        });
    }
    /**
     * Get guest details by full name and microsite slug
     * @param requestBody
     * @returns GuestResponseDto Guest details retrieved successfully
     * @throws ApiError
     */
    public static micrositeControllerGetGuestDetails(
        requestBody: GuestLookupDto,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/microsite/guest/lookup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Guest or microsite not found.`,
            },
        });
    }
    /**
     * Confirm guest attendance for a specific wedding
     * @param requestBody
     * @returns GuestResponseDto Guest confirmed successfully
     * @throws ApiError
     */
    public static micrositeControllerConfirmGuest(
        requestBody: ConfirmGuestDto,
    ): CancelablePromise<GuestResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/microsite/guest/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Guest not found for the specified wedding.`,
                409: `Guest has already confirmed attendance.`,
            },
        });
    }
    /**
     * Create a microsite for a wedding
     * @param requestBody
     * @returns MicrositeResponseDto The microsite has been successfully created.
     * @throws ApiError
     */
    public static micrositeControllerCreateMicrosite(
        requestBody: CreateMicrositeDto,
    ): CancelablePromise<MicrositeResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/microsite',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Admin or wedding not found.`,
                409: `Microsite slug already exists or wedding already has a microsite.`,
            },
        });
    }
    /**
     * Update a microsite
     * @param id
     * @param requestBody
     * @returns MicrositeResponseDto The microsite has been successfully updated.
     * @throws ApiError
     */
    public static micrositeControllerUpdateMicrosite(
        id: number,
        requestBody: UpdateMicrositeDto,
    ): CancelablePromise<MicrositeResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/microsite/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Microsite not found or not owned by admin.`,
                409: `Microsite slug already exists.`,
            },
        });
    }
    /**
     * Delete a microsite
     * @param id
     * @returns any The microsite has been successfully deleted.
     * @throws ApiError
     */
    public static micrositeControllerDeleteMicrosite(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/microsite/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Microsite not found or not owned by admin.`,
            },
        });
    }
}
