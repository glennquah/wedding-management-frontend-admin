/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WishlistItemDetail } from './WishlistItemDetail';
export type GiftSupportInsights = {
    /**
     * Name of guest with highest cash gift contribution
     */
    topContributorName: string | null;
    /**
     * Amount of highest cash gift contribution
     */
    topContribution: number | null;
    /**
     * Name of guest who reserved the most wishlist items
     */
    topWishlistContributorName: string | null;
    /**
     * Number of wishlist items reserved by top contributor
     */
    topWishlistContributorCount: number | null;
    /**
     * Wishlist completion percentage
     */
    wishlistCompletion: number;
    /**
     * Total value of cash gifts received
     */
    totalGiftValue: number;
    /**
     * All wishlist items with reservation details
     */
    wishlistItems: Array<WishlistItemDetail>;
};

