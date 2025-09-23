/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentStatus } from './PaymentStatus';
export type PaymentResponseDto = {
    /**
     * Unique identifier for the payment
     */
    id: number;
    /**
     * Stripe checkout session ID
     */
    stripeCheckoutSessionId: string;
    /**
     * Stripe payment intent ID (populated after payment)
     */
    stripePaymentIntentId?: string;
    /**
     * Payment amount
     */
    amount: number;
    /**
     * Currency code
     */
    currency: string;
    paymentStatus: PaymentStatus;
    /**
     * Order ID this payment belongs to
     */
    orderId: number;
    /**
     * Payment creation timestamp
     */
    createdAt: string;
    /**
     * Payment last update timestamp
     */
    updatedAt: string;
};

