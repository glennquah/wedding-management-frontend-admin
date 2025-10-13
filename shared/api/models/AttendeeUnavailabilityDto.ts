/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendeeUnavailabilityDto = {
    /**
     * Attendee ID
     */
    id: number;
    /**
     * Attendee name
     */
    name: string;
    /**
     * List of unavailable dates in ISO format (YYYY-MM-DD)
     */
    unavailable_dates: Array<string>;
    /**
     * Whether this person is part of the main couple
     */
    is_main_couple: boolean;
};

