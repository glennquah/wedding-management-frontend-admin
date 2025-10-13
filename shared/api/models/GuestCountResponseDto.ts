/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GuestCountResponseDto = {
    /**
     * Total number of guests for the wedding
     */
    totalGuests: number;
    /**
     * Number of primary guests (guests without primaryGuestId)
     */
    primaryGuests: number;
    /**
     * Number of accompanying guests
     */
    accompanyingGuests: number;
};

