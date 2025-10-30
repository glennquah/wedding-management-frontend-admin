/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReviewDto } from '../models/CreateReviewDto';
import type { ReviewResponseDto } from '../models/ReviewResponseDto';
import type { UpdateReviewDto } from '../models/UpdateReviewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReviewsService {
    /**
     * Create a new review
     * @param requestBody
     * @returns ReviewResponseDto The review has been successfully created.
     * @throws ApiError
     */
    public static reviewControllerCreate(
        requestBody: CreateReviewDto,
    ): CancelablePromise<ReviewResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reviews',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                403: `Forbidden.`,
                404: `Order listing not found.`,
            },
        });
    }
    /**
     * Get all reviews
     * @returns ReviewResponseDto List of all reviews.
     * @throws ApiError
     */
    public static reviewControllerFindAll(): CancelablePromise<Array<ReviewResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews',
        });
    }
    /**
     * Get reviews by vendor ID
     * @param vendorId
     * @returns ReviewResponseDto List of reviews for the vendor.
     * @throws ApiError
     */
    public static reviewControllerFindByVendor(
        vendorId: number,
    ): CancelablePromise<Array<ReviewResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/vendor/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
        });
    }
    /**
     * Get reviews by admin ID
     * @param adminId
     * @returns ReviewResponseDto List of reviews created by the admin.
     * @throws ApiError
     */
    public static reviewControllerFindByAdmin(
        adminId: number,
    ): CancelablePromise<Array<ReviewResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/admin/{adminId}',
            path: {
                'adminId': adminId,
            },
        });
    }
    /**
     * Get review by order and listing ID
     * @param orderId
     * @param listingId
     * @returns ReviewResponseDto The review has been found.
     * @throws ApiError
     */
    public static reviewControllerFindByOrderListing(
        orderId: number,
        listingId: number,
    ): CancelablePromise<ReviewResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/order/{orderId}/listing/{listingId}',
            path: {
                'orderId': orderId,
                'listingId': listingId,
            },
            errors: {
                404: `Review not found.`,
            },
        });
    }
    /**
     * Get review by ID
     * @param id
     * @returns ReviewResponseDto The review has been found.
     * @throws ApiError
     */
    public static reviewControllerFindOne(
        id: number,
    ): CancelablePromise<ReviewResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Review not found.`,
            },
        });
    }
    /**
     * Update a review
     * @param id
     * @param requestBody
     * @returns ReviewResponseDto The review has been successfully updated.
     * @throws ApiError
     */
    public static reviewControllerUpdate(
        id: number,
        requestBody: UpdateReviewDto,
    ): CancelablePromise<ReviewResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reviews/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
                404: `Review not found.`,
            },
        });
    }
    /**
     * Delete a review
     * @param id
     * @returns any The review has been successfully deleted.
     * @throws ApiError
     */
    public static reviewControllerRemove(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/reviews/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
                404: `Review not found.`,
            },
        });
    }
}
