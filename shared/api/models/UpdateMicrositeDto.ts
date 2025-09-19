/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateMicrositeDto = {
    /**
     * Template number for the microsite
     */
    templateNumber?: number;
    /**
     * Unique slug for the microsite URL
     */
    slug?: string;
    /**
     * Couple name for the microsite
     */
    coupleName?: string;
    /**
     * Hero images URLs
     */
    heroImages?: Array<string>;
    /**
     * Image gallery URLs
     */
    imageGallery?: Array<string>;
    /**
     * Wedding schedule (stored as JSON)
     */
    schedule?: Array<Record<string, any>>;
    /**
     * Frequently asked questions (stored as JSON)
     */
    faqs?: Array<Record<string, any>>;
    /**
     * Password to access microsite
     */
    password?: string;
};

