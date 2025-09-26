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
     * Success URL to redirect to after payment
     */
    successUrl?: string;
    /**
     * Cancel URL to redirect to if payment is cancelled
     */
    cancelUrl?: string;
};

