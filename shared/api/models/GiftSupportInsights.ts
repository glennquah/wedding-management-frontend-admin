/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GiftSupportInsights = {
    /**
     * Most popular wishlist item
     */
    mostWantedItem: string | null;
    /**
     * Number of reservations for most wanted item
     */
    mostWantedItemCount: number | null;
    /**
     * Name of guest with highest contribution
     */
    topContributorName: string | null;
    /**
     * Amount of highest contribution
     */
    topContribution: number | null;
    /**
     * Wishlist completion percentage
     */
    wishlistCompletion: number;
    /**
     * Total value of gifts and support received
     */
    totalGiftValue: number;
};

