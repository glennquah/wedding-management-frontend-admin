/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BatchPayoutDto = {
    /**
     * Specific vendor IDs to pay out (if not provided, pays all eligible vendors)
     */
    vendorIds?: Array<number>;
    /**
     * Start date for payout period
     */
    periodStart?: string;
    /**
     * End date for payout period (defaults to now)
     */
    periodEnd?: string;
    /**
     * Minimum payout amount (to avoid small transfers)
     */
    minimumPayoutAmount?: number;
};

