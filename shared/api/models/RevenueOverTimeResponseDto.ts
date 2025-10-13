/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RevenueDataPoint } from './RevenueDataPoint';
export type RevenueOverTimeResponseDto = {
    /**
     * Revenue data points over time
     */
    data: Array<RevenueDataPoint>;
    /**
     * Period type
     */
    periodType: RevenueOverTimeResponseDto.periodType;
    /**
     * Currency code
     */
    currency: string;
};
export namespace RevenueOverTimeResponseDto {
    /**
     * Period type
     */
    export enum periodType {
        MONTHLY = 'MONTHLY',
        YEARLY = 'YEARLY',
        ALL = 'ALL',
    }
}

