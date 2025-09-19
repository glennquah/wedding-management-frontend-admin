/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FaqItemDto } from './FaqItemDto';
import type { ScheduleItemDto } from './ScheduleItemDto';
export type CreateMicrositeDto = {
    /**
     * Template number for the microsite
     */
    templateNumber: number;
    /**
     * Unique slug for the microsite URL
     */
    slug: string;
    /**
     * Couple name for the microsite
     */
    coupleName: string;
    /**
     * Hero images URLs
     */
    heroImages?: Array<string>;
    /**
     * Image gallery URLs
     */
    imageGallery?: Array<string>;
    /**
     * Wedding schedule
     */
    schedule?: Array<ScheduleItemDto>;
    /**
     * Frequently asked questions
     */
    faqs?: Array<FaqItemDto>;
    /**
     * Password to access microsite
     */
    password?: string;
    /**
     * Wedding ID to associate with the microsite
     */
    weddingId: number;
};

