/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RevenueDataPoint = {
    /**
     * Period label (YYYY-MM-DD for daily breakdown, YYYY-MM for monthly breakdown)
     */
    period: string;
    /**
     * Revenue for the period
     */
    revenue: number;
    /**
     * Number of orders in the period
     */
    orderCount: number;
};

