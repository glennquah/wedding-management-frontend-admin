/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorRecommendationRequestDto } from '../models/VendorRecommendationRequestDto';
import type { VendorRecommendationResponseDto } from '../models/VendorRecommendationResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VendorRecommendationService {
    /**
     * Get vendor recommendations for a wedding
     *
     * Generate vendor recommendations using a hybrid recommendation algorithm that combines:
     * - Cluster Popularity (α=0.25): Vendors popular among similar weddings
     * - Neighbor-Weighted Collaborative Filtering (β=0.5): Vendors chosen by similar users
     * - Content-Based Similarity (γ=0.25): Vendors matching wedding preferences
     *
     * Returns top-k vendors ranked by combined score with detailed score breakdowns.
     *
     * @param requestBody
     * @returns VendorRecommendationResponseDto Vendor recommendations generated successfully
     * @throws ApiError
     */
    public static vendorRecommendationControllerGetVendorRecommendations(
        requestBody: VendorRecommendationRequestDto,
    ): CancelablePromise<VendorRecommendationResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendor-recommendation/recommend',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request or FastAPI service error`,
                404: `Wedding not found`,
            },
        });
    }
}
