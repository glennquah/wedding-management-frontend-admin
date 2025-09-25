/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CheckoutSessionResponseDto = {
    /**
     * Stripe checkout session URL
     */
    url: string;
    /**
     * Checkout session ID
     */
    sessionId: string;
    /**
     * Payment record
     */
    payment: Record<string, any>;
};

