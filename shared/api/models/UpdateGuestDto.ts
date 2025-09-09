/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateGuestDto = {
    /**
     * The name of the guest
     */
    name?: string;
    /**
     * Allergies or dietary restrictions
     */
    allergies?: string;
    /**
     * Group identifier for the guest
     */
    group?: string;
    /**
     * Primary guest ID if this is an accompanying guest
     */
    primaryGuestId?: number;
    /**
     * Confirmation status of the guest
     */
    confirmationStatus?: UpdateGuestDto.confirmationStatus;
};
export namespace UpdateGuestDto {
    /**
     * Confirmation status of the guest
     */
    export enum confirmationStatus {
        PENDING = 'pending',
        CONFIRMED = 'confirmed',
        REJECTED = 'rejected',
    }
}

