/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DateRecommendationDto } from './DateRecommendationDto';
export type OptimizeDateResponseDto = {
    /**
     * Whether optimization succeeded
     */
    success: boolean;
    /**
     * Status message
     */
    message: string;
    /**
     * List of recommended dates, ordered by score
     */
    recommendations?: Array<DateRecommendationDto>;
    /**
     * Total number of candidate dates analyzed
     */
    total_candidates?: number;
    /**
     * Number of viable dates (after filtering couple conflicts)
     */
    viable_dates?: number;
};

