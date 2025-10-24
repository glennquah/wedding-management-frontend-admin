/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWishlistItemDto } from '../models/CreateWishlistItemDto';
import type { ReserveWishlistItemDto } from '../models/ReserveWishlistItemDto';
import type { UpdateWishlistItemDto } from '../models/UpdateWishlistItemDto';
import type { WishlistItemResponseDto } from '../models/WishlistItemResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WishlistService {
    /**
     * Create a wishlist item
     * @param requestBody
     * @returns WishlistItemResponseDto Wishlist item created successfully
     * @throws ApiError
     */
    public static wishlistControllerCreate(
        requestBody: CreateWishlistItemDto,
    ): CancelablePromise<WishlistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wishlist',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get all wishlist items for a wedding (public)
     * @param weddingId
     * @returns WishlistItemResponseDto Wishlist items retrieved successfully
     * @throws ApiError
     */
    public static wishlistControllerFindAllByWeddingId(
        weddingId: number,
    ): CancelablePromise<Array<WishlistItemResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wishlist/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Check if a wedding has wishlist items
     * @param weddingId
     * @returns any Check result
     * @throws ApiError
     */
    public static wishlistControllerCheckWishlistExists(
        weddingId: number,
    ): CancelablePromise<{
        hasItems?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wishlist/wedding/{weddingId}/check',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get a wishlist item by ID
     * @param id
     * @returns WishlistItemResponseDto Wishlist item retrieved successfully
     * @throws ApiError
     */
    public static wishlistControllerFindOne(
        id: number,
    ): CancelablePromise<WishlistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wishlist/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Wishlist item not found.`,
            },
        });
    }
    /**
     * Update a wishlist item
     * @param id
     * @param requestBody
     * @returns WishlistItemResponseDto Wishlist item updated successfully
     * @throws ApiError
     */
    public static wishlistControllerUpdate(
        id: number,
        requestBody: UpdateWishlistItemDto,
    ): CancelablePromise<WishlistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/wishlist/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wishlist item not found.`,
            },
        });
    }
    /**
     * Delete a wishlist item
     * @param id
     * @returns WishlistItemResponseDto Wishlist item deleted successfully
     * @throws ApiError
     */
    public static wishlistControllerDelete(
        id: number,
    ): CancelablePromise<WishlistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/wishlist/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Wishlist item not found.`,
            },
        });
    }
    /**
     * Reserve or unreserve a wishlist item (public)
     * @param id
     * @param requestBody
     * @returns WishlistItemResponseDto Wishlist item reservation updated successfully
     * @throws ApiError
     */
    public static wishlistControllerReserve(
        id: number,
        requestBody: ReserveWishlistItemDto,
    ): CancelablePromise<WishlistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/wishlist/{id}/reserve',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Item already reserved.`,
                404: `Wishlist item not found.`,
            },
        });
    }
}
