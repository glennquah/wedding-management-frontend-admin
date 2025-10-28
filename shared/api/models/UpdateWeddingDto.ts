/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BudgetBucket } from './BudgetBucket';
import type { GuestCountBucket } from './GuestCountBucket';
import type { WeddingService } from './WeddingService';
import type { WeddingStyle } from './WeddingStyle';
import type { WeddingType } from './WeddingType';
export type UpdateWeddingDto = {
    /**
     * The name of the wedding
     */
    name?: string;
    /**
     * Wedding date
     */
    date?: string;
    /**
     * Wedding location
     */
    location?: string;
    weddingType?: WeddingType;
    budgetBucket?: BudgetBucket;
    guestCountBucket?: GuestCountBucket;
    preferredStyle?: WeddingStyle;
    preferredServices?: Array<WeddingService>;
    /**
     * Allocated budget for the wedding
     */
    allocatedBudget?: number;
    /**
     * PayLah QR code link for the wedding
     */
    payLahQR?: string;
};

