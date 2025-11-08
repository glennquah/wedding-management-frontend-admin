/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendVendorListingDeletionDto = {
    /**
     * The unique ID of the vendor (maps to userId).
     */
    vendorId: number;
    /**
     * The name of the listing that was deleted.
     */
    listingName: string;
    /**
     * The date of removal, preferably in ISO format.
     */
    dateRemoved: string;
    /**
     * The reason for the listing removal.
     */
    reasonForRemoval: string;
};

