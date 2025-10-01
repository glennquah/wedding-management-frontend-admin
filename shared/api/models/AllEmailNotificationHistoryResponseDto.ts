/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AllEmailNotificationHistoryResponseDto = {
    id: number;
    to: Array<string>;
    subject: string;
    body: string;
    sentAt: string;
    type: AllEmailNotificationHistoryResponseDto.type;
    createdAt: string;
    updatedAt: string;
    vendorName?: string;
    weddingName?: string;
};
export namespace AllEmailNotificationHistoryResponseDto {
    export enum type {
        PASSWORD_RESET = 'PASSWORD_RESET',
        WELCOME = 'WELCOME',
        VERIFY_EMAIL = 'VERIFY_EMAIL',
        CREATE_ACCOUNT = 'CREATE_ACCOUNT',
        COLLABORATOR_ADDED = 'COLLABORATOR_ADDED',
        CUSTOM = 'CUSTOM',
    }
}

