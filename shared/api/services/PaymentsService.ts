/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchPayoutDto } from '../models/BatchPayoutDto';
import type { BatchPayoutResultDto } from '../models/BatchPayoutResultDto';
import type { CheckoutSessionResponseDto } from '../models/CheckoutSessionResponseDto';
import type { CreateCheckoutSessionDto } from '../models/CreateCheckoutSessionDto';
import type { CreatePayoutDto } from '../models/CreatePayoutDto';
import type { PaymentResponseDto } from '../models/PaymentResponseDto';
import type { VendorEarningResponseDto } from '../models/VendorEarningResponseDto';
import type { VendorEarningsSummaryDto } from '../models/VendorEarningsSummaryDto';
import type { VendorPayoutResponseDto } from '../models/VendorPayoutResponseDto';
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
    /**
     * Get vendor earnings history
     * @param vendorId
     * @returns VendorEarningResponseDto Vendor earnings retrieved successfully.
     * @throws ApiError
     */
    public static paymentControllerGetVendorEarnings(
        vendorId: number,
    ): CancelablePromise<Array<VendorEarningResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payments/vendor-earnings/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
        });
    }
    /**
     * Get vendor earnings summary
     * @param vendorId
     * @returns VendorEarningsSummaryDto Vendor earnings summary retrieved successfully.
     * @throws ApiError
     */
    public static paymentControllerGetVendorEarningsSummary(
        vendorId: number,
    ): CancelablePromise<VendorEarningsSummaryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payments/vendor-earnings/{vendorId}/summary',
            path: {
                'vendorId': vendorId,
            },
        });
    }
    /**
     * Get vendor payout history
     * @param vendorId
     * @returns VendorPayoutResponseDto Vendor payouts retrieved successfully.
     * @throws ApiError
     */
    public static paymentControllerGetVendorPayouts(
        vendorId: number,
    ): CancelablePromise<Array<VendorPayoutResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payments/vendor-payouts/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
        });
    }
    /**
     * Create a payout for a specific vendor (Super Admin only)
     * @param requestBody
     * @returns VendorPayoutResponseDto Payout created successfully.
     * @throws ApiError
     */
    public static paymentControllerCreateVendorPayout(
        requestBody: CreatePayoutDto,
    ): CancelablePromise<VendorPayoutResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/vendor-payouts/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Create batch payouts for multiple vendors (Super Admin only)
     * @param requestBody
     * @returns BatchPayoutResultDto Batch payouts processed.
     * @throws ApiError
     */
    public static paymentControllerCreateBatchPayouts(
        requestBody: BatchPayoutDto,
    ): CancelablePromise<BatchPayoutResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/vendor-payouts/batch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Manually trigger scheduled payouts (Testing/Admin only)
     * @returns any Scheduled payouts triggered successfully.
     * @throws ApiError
     */
    public static paymentControllerTriggerScheduledPayouts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/vendor-payouts/trigger-scheduled',
        });
    }
    /**
     * Download payout invoice/payslip as PDF
     * @param payoutId
     * @returns any Invoice PDF downloaded successfully.
     * @throws ApiError
     */
    public static paymentControllerDownloadPayoutInvoice(
        payoutId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payments/vendor-payouts/{payoutId}/invoice',
            path: {
                'payoutId': payoutId,
            },
            errors: {
                404: `Payout not found.`,
            },
        });
    }
}
