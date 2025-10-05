/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorScoreDto } from './VendorScoreDto';
export type VendorRecommendationResponseDto = {
    /**
     * Whether recommendation was successful
     */
    success: boolean;
    /**
     * Response message
     */
    message: string;
    /**
     * Cluster the wedding belongs to
     */
    cluster_id?: number;
    /**
     * List of recommended vendors with scores
     */
    recommendations?: Array<VendorScoreDto>;
};

