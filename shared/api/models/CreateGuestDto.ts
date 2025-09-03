/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateGuestDto = {
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
     * Whether the guest has confirmed their attendance
     */
    confirmed?: boolean;
};

