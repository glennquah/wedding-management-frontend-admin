/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GuestResponseDto = {
    /**
     * Guest ID
     */
    id: number;
    /**
     * The name of the guest
     */
    name: string;
    /**
     * Allergies or dietary restrictions
     */
    allergies?: string;
    /**
     * Group identifier for the guest
     */
    group?: string;
    /**
     * Wedding ID this guest belongs to
     */
    weddingId: number;
    /**
     * Primary guest ID if this is an accompanying guest
     */
    primaryGuestId?: number;
    /**
     * Confirmation status of the guest
     */
    confirmationStatus: GuestResponseDto.confirmationStatus;
    /**
     * List of accompanying guests
     */
    accompanyingGuests?: Array<GuestResponseDto>;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
};
export namespace GuestResponseDto {
    /**
     * Confirmation status of the guest
     */
    export enum confirmationStatus {
        PENDING = 'pending',
        CONFIRMED = 'confirmed',
        REJECTED = 'rejected',
    }
}

