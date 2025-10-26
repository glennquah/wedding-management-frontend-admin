/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorPayoutResponseDto } from './VendorPayoutResponseDto';
export type PayoutResultDto = {
    success: boolean;
    vendorId: number;
    payout?: VendorPayoutResponseDto;
    error?: string;
};

