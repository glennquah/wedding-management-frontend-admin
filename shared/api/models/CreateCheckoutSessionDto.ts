/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCheckoutSessionDto = {
    /**
     * Order ID to create checkout session for
     */
    orderId: number;
    /**
     * Optional array of listing IDs to pay for. If not provided, all listings in the order will be included.
     */
    listingIds?: Array<string>;
    /**
     * Success URL to redirect to after payment
     */
    successUrl?: string;
    /**
     * Cancel URL to redirect to if payment is cancelled
     */
    cancelUrl?: string;
};

