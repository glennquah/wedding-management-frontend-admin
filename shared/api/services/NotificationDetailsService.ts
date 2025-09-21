/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEmailTemplateDto } from '../models/CreateEmailTemplateDto';
import type { UpdateEmailTemplateDto } from '../models/UpdateEmailTemplateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationDetailsService {
    /**
     * Create email template for a wedding
     * @param weddingId
     * @param requestBody
     * @returns any The email template has been successfully created.
     * @throws ApiError
     */
    public static notificationDetailsControllerCreateEmailTemplateInWedding(
        weddingId: number,
        requestBody: CreateEmailTemplateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notification-details/weddings/{weddingId}/email-templates',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all email templates for a wedding
     * @param weddingId
     * @returns any Email templates retrieved successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerGetEmailTemplatesForWedding(
        weddingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification-details/weddings/{weddingId}/email-templates',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get email template by ID
     * @param emailTemplateId
     * @returns any Email template retrieved successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerGetEmailTemplateWithId(
        emailTemplateId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification-details/email-templates/{emailTemplateId}',
            path: {
                'emailTemplateId': emailTemplateId,
            },
        });
    }
    /**
     * Update email template by ID
     * @param emailTemplateId
     * @param requestBody
     * @returns any Email template updated successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerUpdateEmailTemplateInWedding(
        emailTemplateId: number,
        requestBody: UpdateEmailTemplateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notification-details/email-templates/{emailTemplateId}',
            path: {
                'emailTemplateId': emailTemplateId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete email template by ID
     * @param emailTemplateId
     * @returns any Email template deleted successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerDeleteEmailTemplate(
        emailTemplateId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notification-details/email-templates/{emailTemplateId}',
            path: {
                'emailTemplateId': emailTemplateId,
            },
        });
    }
    /**
     * Get all email templates
     * @returns any Email templates retrieved successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerGetAllEmailTemplates(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification-details/email-templates',
        });
    }
    /**
     * Get email notification history for a wedding
     * @param weddingId
     * @returns any Email notification history retrieved successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerGetEmailNotificationHistoryWithWeddingId(
        weddingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification-details/weddings/{weddingId}/email-notification-history',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get all email notification history (SuperAdmin only)
     * @returns any All email notification history retrieved successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerGetAllEmailNotificationHistory(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification-details/email-notification-history',
        });
    }
    /**
     * Delete email notification history by ID
     * @param historyId
     * @returns any Email notification history deleted successfully.
     * @throws ApiError
     */
    public static notificationDetailsControllerDeleteEmailNotificationHistory(
        historyId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notification-details/email-notification-history/{historyId}',
            path: {
                'historyId': historyId,
            },
        });
    }
}
