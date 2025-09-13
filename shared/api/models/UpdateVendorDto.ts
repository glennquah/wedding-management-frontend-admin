/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type UpdateVendorDto = {
    /**
     * The name of the user
     */
    name?: string;
    /**
     * Email address of the user
     */
    email?: string;
    /**
     * Password for the user account
     */
    password?: string;
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
    /**
     * Service offered by the vendor
     */
    serviceOffered?: UpdateVendorDto.serviceOffered;
    /**
     * Wedding style specialization of the vendor
     */
    styleOffered?: UpdateVendorDto.styleOffered;
    /**
     * Wedding type specialization of the vendor
     */
    weddingTypes?: Array<'chinese' | 'malay' | 'indian' | 'western' | 'others'>;
    /**
     * Capacity the vendor can handle for venue
     */
    capacity?: number;
};
export namespace UpdateVendorDto {
    /**
     * Service offered by the vendor
     */
    export enum serviceOffered {
        VENUE = 'venue',
        CATERING = 'catering',
        PHOTOGRAPHY = 'photography',
        DECORATION = 'decoration',
        MUSIC = 'music',
        ATTIRE = 'attire',
        MAKEUP = 'makeup',
        TRANSPORTATION = 'transportation',
    }
    /**
     * Wedding style specialization of the vendor
     */
    export enum styleOffered {
        LUXURY = 'luxury',
        MODERN = 'modern',
        TRADITIONAL = 'traditional',
        RUSTIC = 'rustic',
    }
}

