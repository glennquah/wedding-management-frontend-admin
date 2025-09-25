/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SeatingResultDto = {
    /**
     * Whether the optimization was successful
     */
    success: boolean;
    /**
     * Message describing the result
     */
    message: string;
    /**
     * Mapping of table numbers to guest lists
     */
    seating_arrangement?: Record<string, any>;
    /**
     * List of constraint violations, if any
     */
    violated_constraints?: Array<string>;
};

