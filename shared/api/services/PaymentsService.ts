/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CheckoutSessionResponseDto } from '../models/CheckoutSessionResponseDto';
import type { CreateCheckoutSessionDto } from '../models/CreateCheckoutSessionDto';
import type { PaymentResponseDto } from '../models/PaymentResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
    /**
     * Create a Stripe Checkout session for an order
     * @param requestBody
     * @returns CheckoutSessionResponseDto Checkout session created successfully.
     * @throws ApiError
     */
    public static paymentControllerCreateCheckoutSession(
        requestBody: CreateCheckoutSessionDto,
    ): CancelablePromise<CheckoutSessionResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/create-checkout-session',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Order not found.`,
            },
        });
    }
    /**
     * Get payment history for an order
     * @param orderId
     * @returns PaymentResponseDto Payment history retrieved successfully.
     * @throws ApiError
     */
    public static paymentControllerGetPaymentHistory(
        orderId: string,
    ): CancelablePromise<Array<PaymentResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payments/history/{orderId}',
            path: {
                'orderId': orderId,
            },
            errors: {
                404: `Order not found.`,
            },
        });
    }
    /**
     * Handle Stripe webhook events
     * @param stripeSignature
     * @returns any Webhook processed successfully.
     * @throws ApiError
     */
    public static paymentControllerHandleWebhook(
        stripeSignature: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/webhook',
            headers: {
                'stripe-signature': stripeSignature,
            },
            errors: {
                400: `Invalid webhook signature.`,
            },
        });
    }
}
