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
    onboardedDate?: string;
};
export namespace VendorResponseDto {
    /**
     * Role of the user
     */
    export enum role {
        USER = 'user',
        ADMIN = 'admin',
        VENDOR = 'vendor',
    }
}

