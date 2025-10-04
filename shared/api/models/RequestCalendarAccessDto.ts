/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RequestCalendarAccessDto = {
    /**
     * The ID of the attendee (admin or guest) to request calendar access from
     */
    attendeeId: number;
    /**
     * The ID of the wedding
     */
    weddingId: number;
    /**
     * Whether the attendee is an admin (true) or guest (false)
     */
    isAdmin?: boolean;
};

