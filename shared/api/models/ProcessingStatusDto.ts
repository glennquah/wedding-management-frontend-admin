/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProcessingStatusDto = {
    /**
     * Total number of photos in the album
     */
    total: number;
    /**
     * Number of photos pending processing
     */
    pending: number;
    /**
     * Number of photos currently being processed
     */
    processing: number;
    /**
     * Number of photos successfully processed
     */
    completed: number;
    /**
     * Number of photos that failed processing
     */
    failed: number;
    /**
     * Processing completion percentage
     */
    percentage: number;
};

