/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySlotDto } from './AvailabilitySlotDto';
export type CartItemResponseDto = {
    /**
     * Cart Item ID
     */
    id: number;
    /**
     * Listing ID associated with this Cart Item
     */
    listingId: number;
    /**
     * Listing name
     */
    listingName: string;
    /**
     * Total price of cart item
     */
    price: number;
    /**
     * Cart item display image URL
     */
    imageUrls: Array<string>;
    /**
     * Selected availability slot for this cart item
     */
    selectedSlots: Array<AvailabilitySlotDto>;
};

