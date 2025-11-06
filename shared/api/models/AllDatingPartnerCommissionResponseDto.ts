/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDetailsDto } from './AdminDetailsDto';
export type AllDatingPartnerCommissionResponseDto = {
    id: number;
    adminId: number;
    orderId: number;
    listingId: number;
    grossAmount: number;
    commissionRate: number;
    commissionAmount: number;
    currency: string;
    status: string;
    stripeTransferId: string | null;
    failureReason: string | null;
    createdAt: string;
    updatedAt: string;
    admin: AdminDetailsDto;
};

