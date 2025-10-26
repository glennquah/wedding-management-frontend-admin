/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminBasicStatsResponseDto } from '../models/AdminBasicStatsResponseDto';
import type { AdminBookingsOverTimeResponseDto } from '../models/AdminBookingsOverTimeResponseDto';
import type { AdminRevenueByCategoryResponseDto } from '../models/AdminRevenueByCategoryResponseDto';
import type { AdminRevenueResponseDto } from '../models/AdminRevenueResponseDto';
import type { AdminTopListingsResponseDto } from '../models/AdminTopListingsResponseDto';
import type { AdminTopVendorsResponseDto } from '../models/AdminTopVendorsResponseDto';
import type { AdminUserGrowthResponseDto } from '../models/AdminUserGrowthResponseDto';
import type { AdminWeddingDatesHeatmapResponseDto } from '../models/AdminWeddingDatesHeatmapResponseDto';
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
     * Returns revenue data for a vendor: MONTHLY (current month by days), YEARLY (current year by months), ALL (all time by months).
     * @param vendorId
     * @param period Time period: MONTHLY=daily breakdown for current month, YEARLY=monthly breakdown for current year, ALL=monthly breakdown for all time (default: MONTHLY)
     * @returns RevenueOverTimeResponseDto Revenue over time retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetVendorRevenueOverTime(
        vendorId: number,
        period?: 'MONTHLY' | 'YEARLY' | 'ALL',
    ): CancelablePromise<RevenueOverTimeResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/vendor/{vendorId}/revenue-over-time',
            path: {
                'vendorId': vendorId,
            },
            query: {
                'period': period,
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
    /**
     * Get basic platform statistics (Super Admin)
     * Returns total vendors, couples, weddings, microsites, and guests served.
     * @returns AdminBasicStatsResponseDto Basic statistics retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminBasicStats(): CancelablePromise<AdminBasicStatsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/basic-stats',
        });
    }
    /**
     * Get platform revenue analytics (Super Admin)
     * Returns MTD, YTD, and all-time revenue, plus average order value and commission earned.
     * @returns AdminRevenueResponseDto Revenue analytics retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminRevenue(): CancelablePromise<AdminRevenueResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/revenue',
        });
    }
    /**
     * Get platform revenue over time (Super Admin)
     * Returns revenue data: MONTHLY (current month by days), YEARLY (current year by months), ALL (all time by months).
     * @param period Time period: MONTHLY=daily breakdown for current month, YEARLY=monthly breakdown for current year, ALL=monthly breakdown for all time (default: MONTHLY)
     * @returns RevenueOverTimeResponseDto Revenue over time retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminRevenueOverTime(
        period?: 'MONTHLY' | 'YEARLY' | 'ALL',
    ): CancelablePromise<RevenueOverTimeResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/revenue-over-time',
            query: {
                'period': period,
            },
        });
    }
    /**
     * Get revenue breakdown by wedding service category (Super Admin)
     * Returns revenue and booking counts for each wedding service category.
     * @returns AdminRevenueByCategoryResponseDto Revenue by category retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminRevenueByCategory(): CancelablePromise<AdminRevenueByCategoryResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/revenue-by-category',
        });
    }
    /**
     * Get top vendors by revenue (Super Admin)
     * Returns the top vendors sorted by revenue.
     * @param limit Number of top vendors to return (default: 10)
     * @returns AdminTopVendorsResponseDto Top vendors retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminTopVendors(
        limit?: number,
    ): CancelablePromise<AdminTopVendorsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/top-vendors',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get top listings by revenue (Super Admin)
     * Returns the top order listings sorted by revenue.
     * @param limit Number of top listings to return (default: 10)
     * @returns AdminTopListingsResponseDto Top listings retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminTopListings(
        limit?: number,
    ): CancelablePromise<AdminTopListingsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/top-listings',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get platform bookings over time (Super Admin)
     * Returns booking counts and revenue over time: MONTHLY (current month by days), YEARLY (current year by months), ALL (all time by months).
     * @param period Time period: MONTHLY=daily breakdown for current month, YEARLY=monthly breakdown for current year, ALL=monthly breakdown for all time (default: MONTHLY)
     * @returns AdminBookingsOverTimeResponseDto Bookings over time retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminBookingsOverTime(
        period?: 'MONTHLY' | 'YEARLY' | 'ALL',
    ): CancelablePromise<AdminBookingsOverTimeResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/bookings-over-time',
            query: {
                'period': period,
            },
        });
    }
    /**
     * Get wedding dates heatmap (Super Admin)
     * Returns all wedding dates and the count of weddings scheduled for each date.
     * @returns AdminWeddingDatesHeatmapResponseDto Wedding dates heatmap retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminWeddingDatesHeatmap(): CancelablePromise<AdminWeddingDatesHeatmapResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/wedding-dates-heatmap',
        });
    }
    /**
     * Get user growth trend (Super Admin)
     * Returns signup trends for both vendors and couples over time.
     * @param period Time period: MONTHLY=daily breakdown for current month, YEARLY=monthly breakdown for current year, ALL=monthly breakdown for all time (default: MONTHLY)
     * @returns AdminUserGrowthResponseDto User growth trend retrieved successfully
     * @throws ApiError
     */
    public static analyticsControllerGetAdminUserGrowth(
        period?: 'MONTHLY' | 'YEARLY' | 'ALL',
    ): CancelablePromise<AdminUserGrowthResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/admin/user-growth',
            query: {
                'period': period,
            },
        });
    }
}
