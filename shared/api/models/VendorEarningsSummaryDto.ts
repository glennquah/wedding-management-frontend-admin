/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VendorEarningsSummaryDto = {
    vendorId: number;
    /**
     * Total earnings before platform fee
     */
    totalGrossAmount: number;
    /**
     * Total 10% platform commission
     */
    totalPlatformFee: number;
    /**
     * Total amount vendor will receive
     */
    totalNetAmount: number;
    /**
     * Amount already paid out
     */
    paidOutAmount: number;
    /**
     * Amount pending payout
     */
    pendingAmount: number;
    currency: string;
    totalBookings: number;
    paidBookings: number;
    pendingBookings: number;
};

