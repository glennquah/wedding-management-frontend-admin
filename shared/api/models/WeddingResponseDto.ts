/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminResponseDto } from './AdminResponseDto';
import type { BudgetBucket } from './BudgetBucket';
import type { GuestCountBucket } from './GuestCountBucket';
import type { GuestResponseDto } from './GuestResponseDto';
import type { WeddingService } from './WeddingService';
import type { WeddingStyle } from './WeddingStyle';
import type { WeddingType } from './WeddingType';
export type WeddingResponseDto = {
    /**
     * Wedding ID
     */
    id: number;
    /**
     * The ID of the couple getting married
     */
    mainCouple: Array<AdminResponseDto>;
    /**
     * The name of the wedding
     */
    name: string;
    /**
     * Wedding date
     */
    date: string;
    /**
     * Wedding location
     */
    location?: string;
    /**
     * List of guests for this wedding
     */
    guests?: Array<GuestResponseDto>;
    weddingType: WeddingType;
    budgetBucket: BudgetBucket;
    guestCountBucket: GuestCountBucket;
    preferredStyle: WeddingStyle;
    preferredServices: Array<WeddingService>;
    /**
     * PayNow QR code link
     */
    paynowQR?: string;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
    /**
     * Allocated budget for the wedding
     */
    allocatedBudget?: number;
};

