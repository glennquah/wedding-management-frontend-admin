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
        VENDOR_STATUS = 'VENDOR_STATUS',
        VENDOR_SUSPENSION = 'VENDOR_SUSPENSION',
        ADMIN_SUSPENSION = 'ADMIN_SUSPENSION',
        COLLABORATOR_ADDED = 'COLLABORATOR_ADDED',
        CALENDAR_ACCESS_REQUEST = 'CALENDAR_ACCESS_REQUEST',
        RSVP_INVITATION = 'RSVP_INVITATION',
        CUSTOM = 'CUSTOM',
        GUEST_GRATITUDE_CARD = 'GUEST_GRATITUDE_CARD',
        COLLABORATOR_GRATITUDE_CARD = 'COLLABORATOR_GRATITUDE_CARD',
        VENDOR_GRATITUDE_CARD = 'VENDOR_GRATITUDE_CARD',
    }
}

