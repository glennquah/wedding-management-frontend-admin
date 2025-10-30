/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReviewDto = {
    /**
     * Rating from 1 to 5 stars
     */
    rating: number;
    /**
     * Optional review comment
     */
    comment?: string;
    /**
     * Order ID
     */
    orderId: number;
    /**
     * Listing ID
     */
    listingId: number;
    /**
     * Vendor ID
     */
    vendorId: number;
};

