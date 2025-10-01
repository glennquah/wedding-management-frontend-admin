/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySlotDto } from './AvailabilitySlotDto';
export type AddToCartDto = {
    /**
     * Admin ID to associate with this cart
     */
    adminId: number;
    /**
     * Listing ID to add to this cart
     */
    listingId: number;
    /**
     * Selected time slot for the listing
     */
    selectedSlots: Array<AvailabilitySlotDto>;
};

