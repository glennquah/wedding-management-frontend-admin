/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmailNotificationHistoryResponseDto = {
    id: number;
    to: Array<string>;
    subject: string;
    body: string;
    sentAt: string;
    type: EmailNotificationHistoryResponseDto.type;
    createdAt: string;
    updatedAt: string;
    notificationDetailsId: number;
};
export namespace EmailNotificationHistoryResponseDto {
    export enum type {
        PASSWORD_RESET = 'PASSWORD_RESET',
        WELCOME = 'WELCOME',
        VERIFY_EMAIL = 'VERIFY_EMAIL',
        CREATE_ACCOUNT = 'CREATE_ACCOUNT',
        COLLABORATOR_ADDED = 'COLLABORATOR_ADDED',
        CUSTOM = 'CUSTOM',
    }
}

