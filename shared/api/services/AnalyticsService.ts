/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuestCountResponseDto } from '../models/GuestCountResponseDto';
import type { RevenueOverTimeResponseDto } from '../models/RevenueOverTimeResponseDto';
import type { RsvpCountResponseDto } from '../models/RsvpCountResponseDto';
import type { SpendingResponseDto } from '../models/SpendingResponseDto';
import type { VendorBookingsResponseDto } from '../models/VendorBookingsResponseDto';
import type { VendorRevenueResponseDto } from '../models/VendorRevenueResponseDto';
import type { VendorTopProductsResponseDto } from '../models/VendorTopProductsResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Get guest count for a wedding
     * Returns the total number of guests, primary guests, and accompanying guests for a specific wedding.
     * @param weddingId
     * @returns GuestCountResponseDto Guest count retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetGuestCount(
        weddingId: number,
    ): CancelablePromise<GuestCountResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/guest-count/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found`,
            },
        });
    }
    /**
     * Get spending analytics for a wedding
     * Returns total spending from orders, allocated budget, current spending, remaining budget, and budget usage percentage.
     * @param weddingId
     * @returns SpendingResponseDto Spending analytics retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetSpending(
        weddingId: number,
    ): CancelablePromise<SpendingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/spending/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found`,
            },
        });
    }
    /**
     * Get RSVP count for a wedding
     * Returns the number of guests who have confirmed attendance, pending RSVPs, and RSVP percentage.
     * @param weddingId
     * @returns RsvpCountResponseDto RSVP count retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetRsvpCount(
        weddingId: number,
    ): CancelablePromise<RsvpCountResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/rsvp-count/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                404: `Wedding not found`,
            },
        });
    }
    /**
     * Get vendor revenue analytics
     * Returns MTD (Month-to-Date), YTD (Year-to-Date), and all-time revenue for a vendor.
     * @param vendorId
     * @returns VendorRevenueResponseDto Vendor revenue retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetVendorRevenue(
        vendorId: number,
    ): CancelablePromise<VendorRevenueResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/vendor/{vendorId}/revenue',
            path: {
                'vendorId': vendorId,
            },
            errors: {
                404: `Vendor not found`,
            },
        });
    }
    /**
     * Get vendor revenue over time
     * Returns monthly revenue data for a vendor, suitable for line charts.
     * @param vendorId
     * @returns RevenueOverTimeResponseDto Revenue over time retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetVendorRevenueOverTime(
        vendorId: number,
    ): CancelablePromise<RevenueOverTimeResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/vendor/{vendorId}/revenue-over-time',
            path: {
                'vendorId': vendorId,
            },
            errors: {
                404: `Vendor not found`,
            },
        });
    }
    /**
     * Get vendor top selling products
     * Returns the top selling products (listings) for a vendor, sorted by revenue.
     * @param vendorId
     * @param limit
     * @returns VendorTopProductsResponseDto Top products retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetVendorTopProducts(
        vendorId: number,
        limit: number,
    ): CancelablePromise<VendorTopProductsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/vendor/{vendorId}/top-products',
            path: {
                'vendorId': vendorId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Vendor not found`,
            },
        });
    }
    /**
     * Get vendor bookings count
     * Returns total bookings count and breakdown by status (pending, confirmed, completed, cancelled).
     * @param vendorId
     * @returns VendorBookingsResponseDto Bookings count retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetVendorBookings(
        vendorId: number,
    ): CancelablePromise<VendorBookingsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/vendor/{vendorId}/bookings',
            path: {
                'vendorId': vendorId,
            },
            errors: {
                404: `Vendor not found`,
            },
        });
    }
}
