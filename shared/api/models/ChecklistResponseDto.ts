/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessageResponseDto } from './ChatMessageResponseDto';
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
     * Chat history for this checklist
     */
    chatHistory: Array<ChatMessageResponseDto>;
    /**
     * Current stage of the checklist progression
     */
    currentStage: ChecklistResponseDto.currentStage;
    /**
     * Date when the checklist was created
     */
    createdAt: string;
    /**
     * Date when the checklist was last updated
     */
    updatedAt: string;
};
export namespace ChecklistResponseDto {
    /**
     * Current stage of the checklist progression
     */
    export enum currentStage {
        GETTING_STARTED = 'GETTING_STARTED',
        INITIAL_PLANNING = 'INITIAL_PLANNING',
        CREATING_THE_FOUNDATION = 'CREATING_THE_FOUNDATION',
        DETAILED_PLANNING = 'DETAILED_PLANNING',
        DURING_THE_WEDDING = 'DURING_THE_WEDDING',
        AFTER_THE_WEDDING = 'AFTER_THE_WEDDING',
        ADDITIONAL_DETAILS = 'ADDITIONAL_DETAILS',
        CHECKLIST_GENERATED = 'CHECKLIST_GENERATED',
    }
}

