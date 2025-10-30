/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChecklistItemResponseDto = {
    /**
     * Unique identifier for the checklist item
     */
    id: number;
    /**
     * Title of the checklist item
     */
    title: string;
    /**
     * Description of the checklist item
     */
    description: string;
    /**
     * Category of the checklist item
     */
    category: string;
    /**
     * Number of months before wedding to complete this item
     */
    monthsBeforeWedding: number | null;
    /**
     * Whether the item is completed
     */
    completed: boolean;
    /**
     * Checklist ID this item belongs to
     */
    checklistId: number;
    /**
     * Date when the item was created
     */
    createdAt: string;
    /**
     * Date when the item was last updated
     */
    updatedAt: string;
};

