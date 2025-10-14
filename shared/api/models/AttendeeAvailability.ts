/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendeeAvailability = {
    /**
     * The attendee ID (admin or guest)
     */
    attendeeId: number;
    /**
     * The attendee name
     */
    name: string;
    /**
     * Whether calendar is connected
     */
    isConnected: boolean;
    /**
     * List of busy time slots
     */
    busySlots: Array<{
        start?: string;
        end?: string;
    }>;
};

