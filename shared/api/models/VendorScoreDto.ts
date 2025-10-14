/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VendorScoreDto = {
    /**
     * Vendor user ID
     */
    vendor_id: number;
    /**
     * Final weighted score
     */
    final_score: number;
    /**
     * Score based on vendor popularity in user cluster
     */
    cluster_popularity_score: number;
    /**
     * Score based on similar users vendor choices
     */
    neighbor_score: number;
    /**
     * Score based on feature compatibility with user preferences
     */
    content_similarity_score: number;
};

