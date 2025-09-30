/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FaqItemDto } from './FaqItemDto';
import type { ScheduleItemDto } from './ScheduleItemDto';
export type MicrositeResponseDto = {
    /**
     * Microsite ID
     */
    id: number;
    /**
     * Template number
     */
    templateNumber: number;
    /**
     * Microsite slug
     */
    slug: string;
    /**
     * Couple name
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
     * Wedding ID
     */
    weddingId: number;
    /**
     * Wedding name
     */
    weddingName: string;
    /**
     * Wedding location
     */
    weddingLocation?: string;
    /**
     * Wedding date
     */
    weddingDate?: string;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
};

