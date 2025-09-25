/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderStatus } from './OrderStatus';
export type OrderResponseDto = {
    /**
     * Unique identifier for the order
     */
    id: number;
    orderStatus: OrderStatus;
    /**
     * Total amount for the order
     */
    totalAmount: number;
    /**
     * Currency code for the order
     */
    currency: string;
    /**
     * Date when the order was purchased
     */
    purchaseDate: string;
    /**
     * Additional remarks about the order
     */
    remark?: string;
    /**
     * Wedding ID this order belongs to
     */
    weddingId: number;
    /**
     * Order creation timestamp
     */
    createdAt: string;
    /**
     * Order last update timestamp
     */
    updatedAt: string;
    /**
     * Listings included in this order
     */
    listings?: Array<string>;
    /**
     * Payments associated with this order
     */
    payments?: Array<string>;
};

