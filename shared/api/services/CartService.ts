/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddToCartDto } from '../models/AddToCartDto';
import type { CartResponseDto } from '../models/CartResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
    /**
     * Add a listing to the admin cart
     * @param requestBody
     * @returns CartResponseDto
     * @throws ApiError
     */
    public static cartControllerAddToCart(
        requestBody: AddToCartDto,
    ): CancelablePromise<CartResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cart/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get the admin cart with all items
     * @param adminId
     * @returns CartResponseDto
     * @throws ApiError
     */
    public static cartControllerGetCart(
        adminId: number,
    ): CancelablePromise<CartResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cart/{adminId}',
            path: {
                'adminId': adminId,
            },
        });
    }
    /**
     * Delete entire admin cart
     * @param adminId
     * @returns void
     * @throws ApiError
     */
    public static cartControllerDeleteCart(
        adminId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cart/{adminId}',
            path: {
                'adminId': adminId,
            },
        });
    }
    /**
     * Remove a listing from the admin cart
     * @param adminId
     * @param listingId
     * @returns CartResponseDto
     * @throws ApiError
     */
    public static cartControllerRemoveItem(
        adminId: number,
        listingId: number,
    ): CancelablePromise<CartResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cart/{adminId}/item/{listingId}',
            path: {
                'adminId': adminId,
                'listingId': listingId,
            },
        });
    }
    /**
     * Clear all items from the admin cart
     * @param adminId
     * @returns CartResponseDto
     * @throws ApiError
     */
    public static cartControllerClearCart(
        adminId: number,
    ): CancelablePromise<CartResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cart/{adminId}/clear',
            path: {
                'adminId': adminId,
            },
        });
    }
}
