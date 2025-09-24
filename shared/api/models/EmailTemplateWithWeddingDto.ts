/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationDetailsDto } from './NotificationDetailsDto';
export type EmailTemplateWithWeddingDto = {
    id: number;
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    createdAt: string;
    updatedAt: string;
    notificationDetailsId: number;
    notificationDetails: NotificationDetailsDto;
};

