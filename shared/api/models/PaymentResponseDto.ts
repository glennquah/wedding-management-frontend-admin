/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentMethod } from './PaymentMethod';
import type { PaymentStatus } from './PaymentStatus';
export type PaymentResponseDto = {
    /**
     * Unique identifier for the payment
     */
    id: number;
    /**
     * Stripe payment intent ID
     */
    stripePaymentIntentId: string;
    /**
     * Payment amount
     */
    amount: number;
    /**
     * Currency code
     */
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    /**
     * Stripe charge ID
     */
    stripeChargeId?: string;
    /**
     * Receipt URL from Stripe
     */
    receiptUrl?: string;
    /**
     * Failure reason if payment failed
     */
    failureReason?: string;
    /**
     * Amount refunded
     */
    refundedAmount?: number;
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

