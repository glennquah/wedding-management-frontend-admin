/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfirmationStatus } from './ConfirmationStatus';
export type UpdateGuestDto = {
    /**
     * The name of the guest
     */
    name?: string;
    /**
     * The email of the guest
     */
    email?: string;
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
    confirmationStatus?: ConfirmationStatus;
};

