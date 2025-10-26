/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayoutResultDto } from './PayoutResultDto';
export type BatchPayoutResultDto = {
    totalVendors: number;
    successfulPayouts: number;
    failedPayouts: number;
    results: Array<PayoutResultDto>;
    totalAmountPaidOut: number;
    currency: string;
};

