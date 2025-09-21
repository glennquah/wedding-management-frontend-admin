/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfirmPaymentDto } from '../models/ConfirmPaymentDto';
import type { CreatePaymentIntentDto } from '../models/CreatePaymentIntentDto';
import type { PaymentIntentResponseDto } from '../models/PaymentIntentResponseDto';
import type { PaymentResponseDto } from '../models/PaymentResponseDto';
import type { RefundPaymentDto } from '../models/RefundPaymentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
    /**
     * Create a payment intent for an order
     * @param requestBody
     * @returns PaymentIntentResponseDto Payment intent created successfully.
     * @throws ApiError
     */
    public static paymentControllerCreatePaymentIntent(
        requestBody: CreatePaymentIntentDto,
    ): CancelablePromise<PaymentIntentResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/create-intent',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Order not found.`,
            },
        });
    }
    /**
     * Confirm a payment intent
     * @param requestBody
     * @returns PaymentResponseDto Payment confirmed successfully.
     * @throws ApiError
     */
    public static paymentControllerConfirmPayment(
        requestBody: ConfirmPaymentDto,
    ): CancelablePromise<PaymentResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Payment not found.`,
            },
        });
    }
    /**
     * Refund a payment
     * @param requestBody
     * @returns any Payment refunded successfully.
     * @throws ApiError
     */
    public static paymentControllerRefundPayment(
        requestBody: RefundPaymentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/refund',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Payment not eligible for refund.`,
                404: `Payment not found.`,
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
