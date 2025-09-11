/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateGuestDto = {
    /**
     * The ID of the guest
     */
    id?: number;
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
    confirmationStatus?: CreateGuestDto.confirmationStatus;
    /**
     * Names of accompanying guests
     */
    accompanyingGuestNames?: Array<string>;
};
export namespace CreateGuestDto {
    /**
     * Confirmation status of the guest
     */
    export enum confirmationStatus {
        PENDING = 'pending',
        CONFIRMED = 'confirmed',
        REJECTED = 'rejected',
    }
}

