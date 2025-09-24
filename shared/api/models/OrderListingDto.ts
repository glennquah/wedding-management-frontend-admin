/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySlotDto } from './AvailabilitySlotDto';
export type OrderListingDto = {
    /**
     * Listing ID to include in the order
     */
    listingId: number;
    /**
     * Array of booked availability slots for this listing
     */
    bookedSlots: Array<AvailabilitySlotDto>;
};

