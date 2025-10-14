/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendeeUnavailabilityDto } from './AttendeeUnavailabilityDto';
export type OptimizeDateRequestDto = {
    /**
     * Start date for search window (YYYY-MM-DD)
     */
    start_date: string;
    /**
     * End date for search window (YYYY-MM-DD)
     */
    end_date: string;
    /**
     * Main couple unavailable dates (highest priority)
     */
    main_couple_unavailability: Array<AttendeeUnavailabilityDto>;
    /**
     * Key attendees unavailable dates
     */
    key_attendees_unavailability?: Array<AttendeeUnavailabilityDto>;
    /**
     * Preferred days of the week, ordered by preference
     */
    preferred_days?: Array<string>;
    /**
     * Number of top recommendations to return
     */
    top_n?: number;
};

