/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderDto } from '../models/CreateOrderDto';
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
     * Manually trigger cleanup of expired orders
     * @returns any Cleanup completed successfully.
     * @throws ApiError
     */
    public static orderControllerManualCleanup(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/cleanup',
        });
    }
}
