/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySlotDto } from './AvailabilitySlotDto';
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
     * Available time slots for the listing
     */
    availabilities: Array<AvailabilitySlotDto>;
    /**
     * Additional remarks about the listing
     */
    remarks: string;
    /**
     * Vendor ID linked to this listing
     */
    vendorId: number;
    /**
     * Array of image URLs for the listing
     */
    imageUrls: Array<string>;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
};

