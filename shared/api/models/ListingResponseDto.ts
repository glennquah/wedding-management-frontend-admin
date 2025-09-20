/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ListingResponseDto = {
    /**
     * Listing ID
     */
    id: number;
    /**
     * The name of the listing
     */
    listingName: string;
    /**
     * Price of the listing
     */
    price: number;
    /**
     * Available dates for the listing
     */
    availabilities: Array<string>;
    /**
     * Additional remarks about the listing
     */
    remarks: string;
    /**
     * Vendor ID linked to this listing
     */
    vendorId: number;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
    /**
     * Images for the listing
     */
    imageUrls: Array<string>;
};

