/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SquadBreakdownItem } from './SquadBreakdownItem';
export type GuestInsights = {
    /**
     * Total number of guests invited
     */
    totalInvited: number;
    /**
     * Total number of guests confirmed
     */
    totalConfirmed: number;
    /**
     * Total number of guests who attended
     */
    totalAttended: number;
    /**
     * Name of the first guest to arrive
     */
    firstGuestName: string | null;
    /**
     * Time when the first guest checked in
     */
    firstGuestTime: string | null;
    /**
     * Name of guest with fastest RSVP response
     */
    fastestRsvpName: string | null;
    /**
     * Duration in hours for fastest RSVP response
     */
    fastestRsvpDuration: number | null;
    /**
     * Time when most guests were present
     */
    peakTime: string | null;
    /**
     * Number of guests present at peak time
     */
    peakGuestCount: number | null;
    /**
     * Breakdown of guests by group/relationship
     */
    squadBreakdown: Array<SquadBreakdownItem>;
};

