/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatMessageResponseDto = {
    /**
     * Unique identifier for the chat message
     */
    id: string;
    /**
     * Role of the message sender
     */
    role: ChatMessageResponseDto.role;
    /**
     * Content of the chat message
     */
    content: string;
    /**
     * ID of the checklist this message belongs to
     */
    checklistId: number;
    /**
     * Date when the message was created
     */
    createdAt: string;
    /**
     * Date when the message was last updated
     */
    updatedAt: string;
};
export namespace ChatMessageResponseDto {
    /**
     * Role of the message sender
     */
    export enum role {
        ASSISTANT = 'assistant',
        USER = 'user',
    }
}

