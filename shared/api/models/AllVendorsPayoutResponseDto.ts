/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorDetailsDto } from './VendorDetailsDto';
export type AllVendorsPayoutResponseDto = {
    id: number;
    vendorId: number;
    stripeTransferId: string;
    amount: number;
    currency: string;
    status: string;
    earningsCount: number;
    periodStart: string;
    periodEnd: string;
    stripePayoutId: string | null;
    failureReason: string | null;
    createdAt: string;
    updatedAt: string;
    vendor: VendorDetailsDto;
};

