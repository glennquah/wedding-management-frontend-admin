/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuestCountBucket } from './GuestCountBucket';
import type { SeatingGuestDto } from './SeatingGuestDto';
export type SeatingRequestDto = {
    /**
     * Detailed guest records used for optimization
     */
    guests: Array<SeatingGuestDto>;
    guest_count_bucket: GuestCountBucket;
    /**
     * Mapping of groups to their priorities
     */
    group_priorities: Record<string, any>;
    /**
     * Number of tables per row for layout selection
     */
    tables_per_row?: number;
};

