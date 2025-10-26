/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WishlistItemResponseDto = {
    /**
     * Wishlist item ID
     */
    id: number;
    /**
     * Title of the wishlist item
     */
    title: string;
    /**
     * URL of the wishlist item
     */
    itemUrl: string;
    /**
     * Whether the item is reserved
     */
    isReserved: boolean;
    /**
     * Name of the person who reserved the item
     */
    reservedByName?: string;
    /**
     * Wedding ID
     */
    weddingId: number;
    /**
     * Created at timestamp
     */
    createdAt: string;
    /**
     * Updated at timestamp
     */
    updatedAt: string;
};

