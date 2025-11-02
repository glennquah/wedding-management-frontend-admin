/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateChatMessageDto } from './CreateChatMessageDto';
import type { CreateChecklistItemDto } from './CreateChecklistItemDto';
export type UpdateChecklistDto = {
    /**
     * Wedding ID for the checklist
     */
    weddingId?: number;
    /**
     * Complete array of checklist items to replace existing items
     */
    items?: Array<CreateChecklistItemDto>;
    /**
     * Initial chat messages for the checklist
     */
    chatHistory?: Array<CreateChatMessageDto>;
    /**
     * Current stage of the checklist progression
     */
    currentStage?: UpdateChecklistDto.currentStage;
    /**
     * Whether to append chat messages to existing history (true) or replace all chat history (false). Defaults to false.
     */
    appendChatHistory?: boolean;
};
export namespace UpdateChecklistDto {
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

