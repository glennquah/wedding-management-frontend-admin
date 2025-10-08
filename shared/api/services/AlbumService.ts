/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlbumResponseDto } from '../models/AlbumResponseDto';
import type { CreateAlbumDto } from '../models/CreateAlbumDto';
import type { UpdateAlbumDto } from '../models/UpdateAlbumDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AlbumService {
    /**
     * Get album details by wedding ID
     * @param weddingId
     * @returns AlbumResponseDto Album details retrieved successfully
     * @throws ApiError
     */
    public static albumControllerGetAlbumByWeddingId(
        weddingId: number,
    ): CancelablePromise<AlbumResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/album/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                401: `Unauthorized.`,
                403: `Forbidden - Admin role required.`,
                404: `Album not found for the wedding.`,
            },
        });
    }
    /**
     * Create a album for a wedding
     * @param requestBody
     * @returns AlbumResponseDto The album has been successfully created.
     * @throws ApiError
     */
    public static albumControllerCreateAlbum(
        requestBody: CreateAlbumDto,
    ): CancelablePromise<AlbumResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/album',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Admin or wedding not found.`,
                409: `Album slug already exists or wedding already has a album.`,
            },
        });
    }
    /**
     * Update a album
     * @param id
     * @param requestBody
     * @returns AlbumResponseDto The album has been successfully updated.
     * @throws ApiError
     */
    public static albumControllerUpdateAlbum(
        id: number,
        requestBody: UpdateAlbumDto,
    ): CancelablePromise<AlbumResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/album/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Album not found or not owned by admin.`,
                409: `Album slug already exists.`,
            },
        });
    }
    /**
     * Delete a album
     * @param id
     * @returns any The album has been successfully deleted.
     * @throws ApiError
     */
    public static albumControllerDeleteAlbum(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/album/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found or not owned by admin.`,
            },
        });
    }
    /**
     * Add a photo to an album
     * @param id
     * @param requestBody
     * @returns AlbumResponseDto Photo successfully added to the album
     * @throws ApiError
     */
    public static albumControllerAddPhoto(
        id: number,
        requestBody: UpdateAlbumDto,
    ): CancelablePromise<AlbumResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/album/{id}/photos',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Album not found.`,
            },
        });
    }
    /**
     * Download all photos in an album as a ZIP file
     * @param id
     * @returns binary ZIP file containing all album photos
     * @throws ApiError
     */
    public static albumControllerDownloadAlbum(
        id: number,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/album/{id}/download',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found or no photos in album.`,
            },
        });
    }
}
