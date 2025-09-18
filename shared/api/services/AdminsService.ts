/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminResponseDto } from '../models/AdminResponseDto';
import type { CreateAdminDto } from '../models/CreateAdminDto';
import type { UpdateAdminDto } from '../models/UpdateAdminDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminsService {
    /**
     * Create a new admin
     * @param requestBody
     * @returns AdminResponseDto The admin has been successfully created.
     * @throws ApiError
     */
    public static adminControllerCreate(
        requestBody: CreateAdminDto,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admins',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                409: `Admin with this email already exists.`,
            },
        });
    }
    /**
     * Get all admins
     * @returns AdminResponseDto List of all admins
     * @throws ApiError
     */
    public static adminControllerGetAllAdmins(): CancelablePromise<Array<AdminResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins',
        });
    }
    /**
     * Create multiple admins
     * @param requestBody
     * @returns AdminResponseDto The admins have been successfully created.
     * @throws ApiError
     */
    public static adminControllerCreateMultiple(
        requestBody: Array<string>,
    ): CancelablePromise<Array<AdminResponseDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admins/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get an admin by ID
     * @param id
     * @returns AdminResponseDto The admin details
     * @throws ApiError
     */
    public static adminControllerGetAdmin(
        id: number,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Admin not found.`,
            },
        });
    }
    /**
     * Update an admin
     * @param id
     * @param requestBody
     * @returns AdminResponseDto The admin has been successfully updated.
     * @throws ApiError
     */
    public static adminControllerUpdate(
        id: number,
        requestBody: UpdateAdminDto,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admins/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Admin not found.`,
                409: `Admin with this email already exists.`,
            },
        });
    }
    /**
     * Delete an admin
     * @param id
     * @returns any The admin has been successfully deleted.
     * @throws ApiError
     */
    public static adminControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admins/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Admin not found.`,
            },
        });
    }
    /**
     * Get an admin by email
     * @param email
     * @returns AdminResponseDto The admin details
     * @throws ApiError
     */
    public static adminControllerGetAdminByEmail(
        email: string,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/email/{email}',
            path: {
                'email': email,
            },
            errors: {
                404: `Admin not found.`,
            },
        });
    }
    /**
     * Suspend admin
     * @param id
     * @returns AdminResponseDto The admin has been marked as suspended.
     * @throws ApiError
     */
    public static adminControllerSuspendAdmin(
        id: number,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admins/{id}/suspend',
            path: {
                'id': id,
            },
            errors: {
                404: `Admin not found.`,
            },
        });
    }
    /**
     * Unsuspend admin
     * @param id
     * @returns AdminResponseDto The admin has been marked as unsuspended.
     * @throws ApiError
     */
    public static adminControllerUnsuspendAdmin(
        id: number,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admins/{id}/unsuspend',
            path: {
                'id': id,
            },
            errors: {
                404: `Admin not found.`,
            },
        });
    }
    /**
     * Get the main wedding ID for the logged-in admin
     * @returns any The main wedding ID associated with the admin
     * @throws ApiError
     */
    public static adminControllerGetMyMainWedding(): CancelablePromise<{
        /**
         * The ID of the main wedding, or null if not set
         */
        mainWeddingId?: number | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/my-main-wedding',
            errors: {
                404: `Admin not found.`,
            },
        });
    }
}
