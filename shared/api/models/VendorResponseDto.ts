/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VendorResponseDto = {
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
    /**
     * Role of the user
     */
    role: VendorResponseDto.role;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
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
    onboardedDate: string;
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
    serviceOffered: VendorResponseDto.serviceOffered;
    /**
     * Wedding style specialization of the vendor
     */
    styleOffered: VendorResponseDto.styleOffered;
    /**
     * Wedding type specialization of the vendor
     */
    weddingTypes: Array<'chinese' | 'malay' | 'indian' | 'western' | 'others'>;
    /**
     * Capacity the vendor can handle for venue
     */
    capacity?: number;
};
export namespace VendorResponseDto {
    /**
     * Role of the user
     */
    export enum role {
        ADMIN = 'admin',
        SUPER_ADMIN = 'superAdmin',
        VENDOR = 'vendor',
    }
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

