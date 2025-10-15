/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderListingDetailResponseDto = {
    /**
     * ID of the order
     */
    orderId: number;
    /**
     * ID of the listing
     */
    listingId: number;
    /**
     * Name of the listing
     */
    listingName: string;
    /**
     * Date of the order/booking
     */
    date: string;
    /**
     * Status of the order listing
     */
    status: OrderListingDetailResponseDto.status;
    /**
     * Amount for this listing
     */
    amount: number;
    /**
     * Currency
     */
    currency: string;
    /**
     * Vendor name
     */
    vendorName: string;
};
export namespace OrderListingDetailResponseDto {
    /**
     * Status of the order listing
     */
    export enum status {
        PENDING = 'PENDING',
        CONFIRMED = 'CONFIRMED',
        PAID = 'PAID',
        CANCELLED = 'CANCELLED',
        COMPLETED = 'COMPLETED',
    }
}

