/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminRevenueResponseDto = {
    /**
     * Month-to-Date revenue
     */
    mtd: number;
    /**
     * Year-to-Date revenue
     */
    ytd: number;
    /**
     * All-time revenue
     */
    allTime: number;
    /**
     * Average order value (average spent per wedding)
     */
    averageOrderValue: number;
    /**
     * Commission earned (10% of total revenue)
     */
    commissionEarned: number;
    /**
     * Currency code
     */
    currency: string;
};

