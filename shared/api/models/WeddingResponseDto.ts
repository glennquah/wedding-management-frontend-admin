/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
};

