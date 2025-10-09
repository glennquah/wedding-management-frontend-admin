/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateChecklistItemDto } from './CreateChecklistItemDto';
export type CreateChecklistDto = {
    /**
     * Wedding ID for the checklist
     */
    weddingId: number;
    /**
     * Array of checklist items
     */
    items: Array<CreateChecklistItemDto>;
};

