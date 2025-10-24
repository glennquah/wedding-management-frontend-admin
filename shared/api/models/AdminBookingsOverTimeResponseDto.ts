/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookingDataPoint } from './BookingDataPoint';
export type AdminBookingsOverTimeResponseDto = {
    /**
     * Bookings data over time
     */
    data: Array<BookingDataPoint>;
    /**
     * Period type (MONTHLY, YEARLY, ALL)
     */
    periodType: string;
    /**
     * Currency code
     */
    currency: string;
};

