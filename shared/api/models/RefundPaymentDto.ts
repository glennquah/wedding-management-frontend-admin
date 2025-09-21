/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RefundPaymentDto = {
    /**
     * Stripe payment intent ID to refund
     */
    paymentIntentId: string;
    /**
     * Amount to refund. If not provided, full amount will be refunded.
     */
    amount?: number;
};

