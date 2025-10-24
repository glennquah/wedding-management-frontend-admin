/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePayoutDto = {
    /**
     * Vendor ID to pay out
     */
    vendorId: number;
    /**
     * Start date for payout period (defaults to last payout)
     */
    periodStart?: string;
    /**
     * End date for payout period (defaults to now)
     */
    periodEnd?: string;
};

