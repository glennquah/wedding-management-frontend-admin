/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSuperAdminDto } from '../models/CreateSuperAdminDto';
import type { SuperAdminResponseDto } from '../models/SuperAdminResponseDto';
import type { UpdateSuperAdminDto } from '../models/UpdateSuperAdminDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SuperAdminsService {
    /**
     * Create a new super admin
     * @param requestBody
     * @returns SuperAdminResponseDto The super admin has been successfully created.
     * @throws ApiError
     */
    public static superAdminControllerCreate(
        requestBody: CreateSuperAdminDto,
    ): CancelablePromise<SuperAdminResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/super-admins',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                409: `Super admin with this email already exists.`,
            },
        });
    }
    /**
     * Get all super admins
     * @returns SuperAdminResponseDto List of all super admins
     * @throws ApiError
     */
    public static superAdminControllerGetAllAdmins(): CancelablePromise<Array<SuperAdminResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/super-admins',
        });
    }
    /**
     * Create multiple super admins
     * @param requestBody
     * @returns SuperAdminResponseDto The super admins have been successfully created.
     * @throws ApiError
     */
    public static superAdminControllerCreateMultiple(
        requestBody: Array<string>,
    ): CancelablePromise<Array<SuperAdminResponseDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/super-admins/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get a super admin by ID
     * @param id
     * @returns SuperAdminResponseDto The super admin details
     * @throws ApiError
     */
    public static superAdminControllerGetAdmin(
        id: number,
    ): CancelablePromise<SuperAdminResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/super-admins/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Super admin not found.`,
            },
        });
    }
    /**
     * Update a super admin
     * @param id
     * @param requestBody
     * @returns SuperAdminResponseDto The super admin has been successfully updated.
     * @throws ApiError
     */
    public static superAdminControllerUpdate(
        id: number,
        requestBody: UpdateSuperAdminDto,
    ): CancelablePromise<SuperAdminResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/super-admins/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Super admin not found.`,
                409: `Super admin with this email already exists.`,
            },
        });
    }
    /**
     * Delete a super admin
     * @param id
     * @returns any The super admin has been successfully deleted.
     * @throws ApiError
     */
    public static superAdminControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/super-admins/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Super admin not found.`,
            },
        });
    }
    /**
     * Get a super admin by email
     * @param email
     * @returns SuperAdminResponseDto The super admin details
     * @throws ApiError
     */
    public static superAdminControllerGetAdminByEmail(
        email: string,
    ): CancelablePromise<SuperAdminResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/super-admins/email/{email}',
            path: {
                'email': email,
            },
            errors: {
                404: `Super admin not found.`,
            },
        });
    }
}
