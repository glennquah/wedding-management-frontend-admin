/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentMethod } from './PaymentMethod';
export type CreatePaymentIntentDto = {
    /**
     * Order ID to create payment intent for
     */
    orderId: number;
    paymentMethod: PaymentMethod;
};

