/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CashGiftResponseDto = {
    /**
     * The ID of the cash gift
     */
    id: number;
    /**
     * The ID of the guest who gave the cash gift
     */
    guestId: number;
    /**
     * The name of the guest who gave the cash gift
     */
    guestName: string;
    /**
     * The amount of the cash gift
     */
    amount: number;
    /**
     * The ID of the wedding this cash gift belongs to
     */
    weddingId: number;
    /**
     * The creation date of the cash gift record
     */
    createdAt: string;
    /**
     * The last update date of the cash gift record
     */
    updatedAt: string;
};

