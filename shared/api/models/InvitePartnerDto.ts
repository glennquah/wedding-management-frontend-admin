/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InvitePartnerDto = {
    /**
     * Guest ID to invite as partner (optional if email and name provided)
     */
    guestId?: number;
    /**
     * Email of the partner being invited
     */
    email: string;
    /**
     * Name of the partner being invited
     */
    name: string;
    /**
     * Wedding ID to add as partner to main couple
     */
    weddingId: number;
};

