/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlbumResponseDto } from '../models/AlbumResponseDto';
import type { CreateAlbumDto } from '../models/CreateAlbumDto';
import type { FaceClusterDto } from '../models/FaceClusterDto';
import type { ProcessingStatusDto } from '../models/ProcessingStatusDto';
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
     * Create an album for a wedding
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
                409: `Album slug already exists or wedding already has an album.`,
            },
        });
    }
    /**
     * Update an album
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
     * Delete an album
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
     * Get photo processing status for an album
     * Returns statistics about photo processing progress including counts of pending, processing, completed, and failed photos
     * @param id
     * @returns ProcessingStatusDto Processing status retrieved successfully
     * @throws ApiError
     */
    public static albumControllerGetProcessingStatus(
        id: number,
    ): CancelablePromise<ProcessingStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/album/{id}/processing-status',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found.`,
            },
        });
    }
    /**
     * Get face clusters for an album
     * Returns groups of similar faces detected in the album photos. Each cluster represents a person.
     * @param id
     * @returns FaceClusterDto Face clusters retrieved successfully
     * @throws ApiError
     */
    public static albumControllerGetFaceClusters(
        id: number,
    ): CancelablePromise<Array<FaceClusterDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/album/{id}/face-clusters',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found.`,
            },
        });
    }
    /**
     * Manually trigger face clustering for an album
     * Triggers face clustering for all unclustered faces in the album. This is automatically done after photo upload, but can be manually triggered if needed.
     * @param id
     * @returns any Clustering completed successfully
     * @throws ApiError
     */
    public static albumControllerTriggerClustering(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/album/{id}/trigger-clustering',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found.`,
            },
        });
    }
    /**
     * Update label for a face cluster
     * Set a custom label for a face cluster (e.g., "Bride", "Groom", "Best Man")
     * @param albumId
     * @param clusterId
     * @returns any Cluster label updated successfully
     * @throws ApiError
     */
    public static albumControllerUpdateClusterLabel(
        albumId: number,
        clusterId: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/album/{albumId}/clusters/{clusterId}/label',
            path: {
                'albumId': albumId,
                'clusterId': clusterId,
            },
            errors: {
                404: `Cluster not found.`,
            },
        });
    }
    /**
     * Re-cluster all faces in an album
     * Clears existing face clusters and re-runs the clustering algorithm. Useful if clustering parameters are adjusted.
     * @param id
     * @returns any Re-clustering completed successfully
     * @throws ApiError
     */
    public static albumControllerReclusterAlbum(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/album/{id}/recluster',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found.`,
            },
        });
    }
    /**
     * Get blurry photo indices for an album
     * Returns array indices of photos that have been detected as blurry
     * @param id
     * @returns number Blurry photo indices retrieved successfully
     * @throws ApiError
     */
    public static albumControllerGetBlurryPhotos(
        id: number,
    ): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/album/{id}/blurry-photos',
            path: {
                'id': id,
            },
            errors: {
                404: `Album not found.`,
            },
        });
    }
}
