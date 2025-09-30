/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CartItemResponseDto } from './CartItemResponseDto';
export type CartResponseDto = {
    /**
     * Cart ID
     */
    id: number;
    /**
     * Admin ID associated with this cart
     */
    adminId: number;
    /**
     * Total price amount of items in the cart
     */
    total: number;
    /**
     * List of items in the cart
     */
    items?: Array<CartItemResponseDto>;
};

