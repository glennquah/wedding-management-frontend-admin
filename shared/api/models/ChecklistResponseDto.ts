/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChecklistItemResponseDto } from './ChecklistItemResponseDto';
export type ChecklistResponseDto = {
    /**
     * Unique identifier for the checklist
     */
    id: number;
    /**
     * Wedding ID this checklist belongs to
     */
    weddingId: number;
    /**
     * Array of checklist items
     */
    items: Array<ChecklistItemResponseDto>;
    /**
     * Date when the checklist was created
     */
    createdAt: string;
    /**
     * Date when the checklist was last updated
     */
    updatedAt: string;
};

