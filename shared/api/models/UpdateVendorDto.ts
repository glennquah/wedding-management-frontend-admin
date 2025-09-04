/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
    /**
     * Role of the user
     */
    role?: UpdateVendorDto.role;
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
export namespace UpdateVendorDto {
    /**
     * Role of the user
     */
    export enum role {
        USER = 'user',
        ADMIN = 'admin',
        VENDOR = 'vendor',
    }
}

