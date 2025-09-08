/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BudgetBucket } from './BudgetBucket';
import type { GuestCountBucket } from './GuestCountBucket';
import type { UserRole } from './UserRole';
import type { WeddingService } from './WeddingService';
import type { WeddingStyle } from './WeddingStyle';
import type { WeddingType } from './WeddingType';
export type CreateAdminDto = {
    /**
     * The name of the user
     */
    name: string;
    /**
     * Email address of the user
     */
    email: string;
    /**
     * Password for the user account
     */
    password: string;
    role: UserRole;
    /**
     * Is the admin a couple?
     */
    isCouple?: boolean;
    /**
     * Date when the admin was onboarded
     */
    onboardedDate: string;
    weddingType: WeddingType;
    budgetBucket: BudgetBucket;
    guestCountBucket: GuestCountBucket;
    preferredStyle: WeddingStyle;
    preferredServices: Array<WeddingService>;
};

