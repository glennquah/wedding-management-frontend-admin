/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderDto } from '../models/CreateOrderDto';
import type { OrderListingDetailResponseDto } from '../models/OrderListingDetailResponseDto';
import type { OrderResponseDto } from '../models/OrderResponseDto';
import type { UpdateOrderDto } from '../models/UpdateOrderDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Create a new order
     * @param requestBody
     * @returns OrderResponseDto The order has been successfully created.
     * @throws ApiError
     */
    public static orderControllerCreate(
        requestBody: CreateOrderDto,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding or listings not found.`,
            },
        });
    }
    /**
     * Get all orders
     * @returns OrderResponseDto List of all orders.
     * @throws ApiError
     */
    public static orderControllerFindAll(): CancelablePromise<Array<OrderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders',
        });
    }
    /**
     * Get order by ID
     * @param id
     * @returns OrderResponseDto The order has been found.
     * @throws ApiError
     */
    public static orderControllerFindOne(
        id: number,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Order not found.`,
            },
        });
    }
    /**
     * Update an order
     * @param id
     * @param requestBody
     * @returns OrderResponseDto The order has been successfully updated.
     * @throws ApiError
     */
    public static orderControllerUpdate(
        id: number,
        requestBody: UpdateOrderDto,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Order not found.`,
            },
        });
    }
    /**
     * Delete an order
     * @param id
     * @returns any The order has been successfully deleted.
     * @throws ApiError
     */
    public static orderControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Order not found.`,
            },
        });
    }
    /**
     * Get orders by wedding ID
     * @param weddingId
     * @returns OrderResponseDto List of orders for the wedding.
     * @throws ApiError
     */
    public static orderControllerFindByWedding(
        weddingId: number,
    ): CancelablePromise<Array<OrderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get successful orders (PAID or COMPLETED) by wedding ID
     * @param weddingId
     * @returns OrderResponseDto List of successful orders for the wedding.
     * @throws ApiError
     */
    public static orderControllerFindSuccessfulOrdersByWedding(
        weddingId: number,
    ): CancelablePromise<Array<OrderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/wedding/{weddingId}/successful',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get detailed order listing information (listing name, date, status, amount) by wedding ID
     * @param weddingId
     * @returns OrderListingDetailResponseDto List of order listing details for the wedding.
     * @throws ApiError
     */
    public static orderControllerGetOrderListingDetailsByWedding(
        weddingId: number,
    ): CancelablePromise<Array<OrderListingDetailResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/wedding/{weddingId}/listing-details',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found.`,
            },
        });
    }
    /**
     * Get orders by vendor ID
     * @param vendorId
     * @returns OrderResponseDto List of orders containing listings from this vendor.
     * @throws ApiError
     */
    public static orderControllerFindByVendor(
        vendorId: number,
    ): CancelablePromise<Array<OrderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/vendor/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
            errors: {
                404: `Vendor not found.`,
            },
        });
    }
    /**
     * Cancel an order
     * @param id
     * @returns OrderResponseDto The order has been successfully cancelled.
     * @throws ApiError
     */
    public static orderControllerCancel(
        id: number,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{id}/cancel',
            path: {
                'id': id,
            },
            errors: {
                400: `Order cannot be cancelled.`,
                404: `Order not found.`,
            },
        });
    }
    /**
     * Delete a single listing from an order
     * @param orderId
     * @param listingId
     * @returns any The order listing has been deleted.
     * @throws ApiError
     */
    public static orderControllerDeleteListing(
        orderId: number,
        listingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/{orderId}/listings/{listingId}',
            path: {
                'orderId': orderId,
                'listingId': listingId,
            },
            errors: {
                404: `Order or listing not found.`,
            },
        });
    }
    /**
     * Vendor confirms a specific listing in an order
     * @param orderId
     * @param listingId
     * @returns OrderResponseDto The listing has been successfully confirmed by the vendor.
     * @throws ApiError
     */
    public static orderControllerVendorConfirmListing(
        orderId: number,
        listingId: number,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/listings/{listingId}/vendor-confirm',
            path: {
                'orderId': orderId,
                'listingId': listingId,
            },
            errors: {
                400: `Listing cannot be confirmed.`,
                403: `Vendor does not own this listing.`,
                404: `Order or listing not found.`,
            },
        });
    }
    /**
     * Vendor rejects a specific listing in an order and triggers partial refund
     * @param orderId
     * @param listingId
     * @returns OrderResponseDto The listing has been successfully rejected by the vendor and partial refund processed.
     * @throws ApiError
     */
    public static orderControllerVendorRejectListing(
        orderId: number,
        listingId: number,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/listings/{listingId}/vendor-reject',
            path: {
                'orderId': orderId,
                'listingId': listingId,
            },
            errors: {
                400: `Listing cannot be rejected.`,
                403: `Vendor does not own this listing.`,
                404: `Order or listing not found.`,
            },
        });
    }
    /**
     * Vendor marks a specific listing in an order as completed
     * @param orderId
     * @param listingId
     * @returns OrderResponseDto The listing has been successfully marked as completed.
     * @throws ApiError
     */
    public static orderControllerVendorCompleteListing(
        orderId: number,
        listingId: number,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/listings/{listingId}/vendor-complete',
            path: {
                'orderId': orderId,
                'listingId': listingId,
            },
            errors: {
                400: `Listing cannot be completed or booking dates have not passed.`,
                403: `Vendor does not own this listing.`,
                404: `Order or listing not found.`,
            },
        });
    }
    /**
     * Superadmin marks a specific listing in an order as completed
     * @param orderId
     * @param listingId
     * @returns OrderResponseDto The listing has been successfully marked as completed.
     * @throws ApiError
     */
    public static orderControllerSuperadminCompleteListing(
        orderId: number,
        listingId: number,
    ): CancelablePromise<OrderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/listings/{listingId}/superadmin-complete',
            path: {
                'orderId': orderId,
                'listingId': listingId,
            },
            errors: {
                400: `Listing cannot be completed or booking dates have not passed.`,
                404: `Order or listing not found.`,
            },
        });
    }
}
