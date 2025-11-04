/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
import type { WeddingDetailsDto } from './WeddingDetailsDto';
export type AdminResponseDto = {
    /**
     * User ID
     */
    id: number;
    /**
     * The name of the user
     */
    name: string;
    /**
     * Email address of the user
     */
    email: string;
    role: UserRole;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
    /**
     * Is the admin suspended?
     */
    isSuspended?: boolean;
    /**
     * Is the admin registered from dating app platform?
     */
    isDatingPartnerRegistered?: boolean;
    /**
     * Date when the admin was onboarded
     */
    onboardedDate: string;
    /**
     * List of weddings associated with the admin
     */
    weddings?: Array<WeddingDetailsDto>;
};

