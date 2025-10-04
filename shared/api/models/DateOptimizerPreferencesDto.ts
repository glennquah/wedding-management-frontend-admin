/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OptimizeDateResponseDto } from './OptimizeDateResponseDto';
export type DateOptimizerPreferencesDto = {
    /**
     * Earliest date for wedding date optimization
     */
    earliestDate?: string;
    /**
     * Latest date for wedding date optimization
     */
    latestDate?: string;
    /**
     * Preferred days of the week
     */
    preferredDays?: Array<string>;
    /**
     * Last analysis results from AI optimizer
     */
    lastResults?: OptimizeDateResponseDto;
};

