/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
import type { VendorOnboardingStatus } from './VendorOnboardingStatus';
import type { WeddingService } from './WeddingService';
import type { WeddingStyle } from './WeddingStyle';
import type { WeddingType } from './WeddingType';
export type CreateVendorDto = {
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
     * Vendor website URL
     */
    vendorWebsite?: string;
    /**
     * Unique Entity Number (UEN) of the vendor
     */
    uenNumber?: string;
    /**
     * Date when the vendor was onboarded
     */
    onboardedDate?: string;
    /**
     * Short biography of the vendor
     */
    bio?: string;
    /**
     * Rating of the vendor
     */
    rating?: number;
    serviceOffered?: WeddingService;
    styleOffered?: WeddingStyle;
    weddingTypes?: Array<WeddingType>;
    /**
     * Capacity the vendor can handle for venue
     */
    capacity?: number;
    onboardingStatus?: VendorOnboardingStatus;
};

