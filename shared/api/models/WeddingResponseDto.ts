/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuestResponseDto } from './GuestResponseDto';

export type WeddingResponseDto = {
    /**
     * Wedding ID
     */
    id: number;
    /**
     * The name of the wedding
     */
    name: string;
    /**
     * Wedding date
     */
    date: string;
    /**
     * Wedding location
     */
    location?: string;
    /**
     * List of guests for this wedding
     */
    guests?: Array<GuestResponseDto>;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
};