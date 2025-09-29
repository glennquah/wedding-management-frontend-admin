/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConfirmGuestDto = {
    /**
     * Guest ID to confirm
     */
    guestId: number;
    /**
     * Wedding ID to confirm guest for
     */
    weddingId: number;
    /**
     * Food allergies to store for the guest
     */
    allergies?: string;
};

