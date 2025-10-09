/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GiftResponseDto = {
    /**
     * The ID of the gift
     */
    id: number;
    /**
     * The name of the guest who gave the gift
     */
    guestName: string;
    /**
     * The amount of the gift
     */
    amount: number;
    /**
     * The ID of the wedding this gift belongs to
     */
    weddingId: number;
    /**
     * The creation date of the gift record
     */
    createdAt: string;
    /**
     * The last update date of the gift record
     */
    updatedAt: string;
};

