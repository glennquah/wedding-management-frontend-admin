/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentResponseDto } from './PaymentResponseDto';
export type PaymentIntentResponseDto = {
    /**
     * Stripe client secret for frontend payment processing
     */
    clientSecret: string;
    /**
     * Stripe payment intent ID
     */
    paymentIntentId: string;
    /**
     * Created payment record
     */
    payment: PaymentResponseDto;
};

