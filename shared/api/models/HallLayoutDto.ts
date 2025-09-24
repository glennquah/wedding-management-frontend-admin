/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LayoutConfigDto } from './LayoutConfigDto';
export type HallLayoutDto = {
    /**
     * Layout configuration data from FastAPI
     */
    layout: LayoutConfigDto;
    /**
     * Guest count bucket this layout is for
     */
    guest_count_bucket: string;
    /**
     * Additional metadata about the layout
     */
    metadata?: Record<string, any>;
};

