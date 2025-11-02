/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChecklistStatsResponseDto = {
    /**
     * Total number of items in checklist
     */
    total: number;
    /**
     * Number of completed items in checklist
     */
    completed: number;
    /**
     * Overall completion percentage
     */
    percentage: number;
    /**
     * Statistics broken down by category
     */
    byCategory: Record<string, {
        total?: number;
        completed?: number;
        percentage?: number;
    }>;
};

