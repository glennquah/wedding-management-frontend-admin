/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendeeAvailability = {
    /**
     * The collaborator ID
     */
    collaboratorId: number;
    /**
     * The collaborator name
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

