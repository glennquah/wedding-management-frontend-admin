/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewResponseDto = {
    /**
     * Review ID
     */
    id: number;
    /**
     * Rating from 1 to 5 stars
     */
    rating: number;
    /**
     * Review comment
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
    /**
     * Admin ID (reviewer)
     */
    adminId: number;
    /**
     * Wedding couple names
     */
    weddingCouple?: string;
    /**
     * Review creation date
     */
    createdAt: string;
    /**
     * Review last update date
     */
    updatedAt: string;
};

