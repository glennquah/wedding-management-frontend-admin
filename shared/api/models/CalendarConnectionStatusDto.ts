/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CalendarConnectionStatusDto = {
    /**
     * Whether the calendar is connected
     */
    isConnected: boolean;
    /**
     * The calendar access status
     */
    accessStatus: CalendarConnectionStatusDto.accessStatus;
    /**
     * The email associated with the calendar connection
     */
    email?: string;
    /**
     * The date when the connection was established
     */
    connectedAt?: string;
    /**
     * The date when access was requested
     */
    accessRequestedAt?: string;
};
export namespace CalendarConnectionStatusDto {
    /**
     * The calendar access status
     */
    export enum accessStatus {
        NOT_REQUESTED = 'NOT_REQUESTED',
        REQUESTED = 'REQUESTED',
        REJECTED = 'REJECTED',
        CONNECTED = 'CONNECTED',
    }
}

