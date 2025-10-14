/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminResponseDto } from '../models/AdminResponseDto';
import type { CollaboratorResponseDto } from '../models/CollaboratorResponseDto';
import type { CreateAdminDto } from '../models/CreateAdminDto';
import type { InviteCollaboratorDto } from '../models/InviteCollaboratorDto';
import type { InvitePartnerDto } from '../models/InvitePartnerDto';
import type { UpdateAdminDto } from '../models/UpdateAdminDto';
import type { WeddingResponseDto } from '../models/WeddingResponseDto';
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
    /**
     * Get all weddings associated with the logged-in admin
     * @returns WeddingResponseDto List of weddings associated with the admin
     * @throws ApiError
     */
    public static adminControllerGetMyWeddings(): CancelablePromise<Array<WeddingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/my-weddings',
            errors: {
                404: `Admin not found.`,
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
     * Delete an admin (super admin only, no password required)
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
     * Delete own admin profile (requires password confirmation)
     * @param requestBody
     * @returns any The admin profile has been successfully deleted.
     * @throws ApiError
     */
    public static adminControllerDeleteSelf(
        requestBody: {
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admins/delete-self',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid password.`,
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
     * Invite a guest as a collaborator to a wedding
     * @param requestBody
     * @returns CollaboratorResponseDto Collaborator has been successfully invited.
     * @throws ApiError
     */
    public static adminControllerInviteCollaborator(
        requestBody: InviteCollaboratorDto,
    ): CancelablePromise<CollaboratorResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admins/invite-collaborator',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding or guest not found.`,
            },
        });
    }
    /**
     * Get all collaborators for a wedding
     * @param weddingId
     * @returns AdminResponseDto List of collaborators for the wedding
     * @throws ApiError
     */
    public static adminControllerGetCollaborators(
        weddingId: number,
    ): CancelablePromise<Array<AdminResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/wedding/{weddingId}/collaborators',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Remove a collaborator from a wedding
     * @param weddingId
     * @param userId
     * @returns any Collaborator has been successfully removed.
     * @throws ApiError
     */
    public static adminControllerRemoveCollaborator(
        weddingId: number,
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admins/wedding/{weddingId}/collaborator/{userId}',
            path: {
                'weddingId': weddingId,
                'userId': userId,
            },
            errors: {
                404: `Wedding not found.`,
                409: `Cannot remove main couple as collaborator.`,
            },
        });
    }
    /**
     * Invite a person as partner to the main couple
     * @param requestBody
     * @returns CollaboratorResponseDto Partner has been successfully invited.
     * @throws ApiError
     */
    public static adminControllerInvitePartner(
        requestBody: InvitePartnerDto,
    ): CancelablePromise<CollaboratorResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admins/invite-partner',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding or guest not found.`,
                409: `Main couple already has 2 members.`,
            },
        });
    }
    /**
     * Remove a partner from the main couple
     * @param weddingId
     * @param userId
     * @returns any Partner has been successfully removed from main couple.
     * @throws ApiError
     */
    public static adminControllerRemovePartner(
        weddingId: number,
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admins/wedding/{weddingId}/partner/{userId}',
            path: {
                'weddingId': weddingId,
                'userId': userId,
            },
            errors: {
                404: `Wedding or partner not found.`,
            },
        });
    }
}
