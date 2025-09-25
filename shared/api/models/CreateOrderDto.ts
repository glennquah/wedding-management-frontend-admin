/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderListingDto } from './OrderListingDto';
export type CreateOrderDto = {
    /**
     * Wedding ID this order belongs to
     */
    weddingId: number;
    /**
     * Array of listings with their booked dates
     */
    listings: Array<OrderListingDto>;
    /**
     * Additional remarks about the order
     */
    remark?: string;
};

