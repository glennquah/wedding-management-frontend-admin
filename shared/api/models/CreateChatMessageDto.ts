/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateChatMessageDto = {
    /**
     * Role of the message sender
     */
    role: CreateChatMessageDto.role;
    /**
     * Content of the chat message
     */
    content: string;
    /**
     * Timestamp when the message was created
     */
    createdAt?: string;
};
export namespace CreateChatMessageDto {
    /**
     * Role of the message sender
     */
    export enum role {
        ASSISTANT = 'assistant',
        USER = 'user',
    }
}

