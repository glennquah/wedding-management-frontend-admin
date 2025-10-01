/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AvailabilityCheckDto = {
    /**
     * Array of collaborator IDs to check availability for
     */
    collaboratorIds: Array<number>;
    /**
     * Start date for availability check (ISO 8601 format)
     */
    startDate: string;
    /**
     * End date for availability check (ISO 8601 format)
     */
    endDate: string;
};

