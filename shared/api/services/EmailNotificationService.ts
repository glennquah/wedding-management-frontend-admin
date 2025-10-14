/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BroadcastRsvpInvitationDto } from '../models/BroadcastRsvpInvitationDto';
import type { EmailTemplateResponse } from '../models/EmailTemplateResponse';
import type { GenerateAiEmailTemplateDto } from '../models/GenerateAiEmailTemplateDto';
import type { SendBulkEmailDto } from '../models/SendBulkEmailDto';
import type { SendRsvpInvitationDto } from '../models/SendRsvpInvitationDto';
import type { SendSingleEmailDto } from '../models/SendSingleEmailDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmailNotificationService {
    /**
     * Send an email notification
     * @param requestBody
     * @returns any The email has been successfully sent.
     * @throws ApiError
     */
    public static emailNotificationControllerSendEmail(
        requestBody: SendSingleEmailDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/send',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send bulk email notifications
     * @param requestBody
     * @returns any The emails have been successfully sent.
     * @throws ApiError
     */
    public static emailNotificationControllerSendBulkEmail(
        requestBody: SendBulkEmailDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/send-bulk',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send RSVP invitation email to a guest
     * @param requestBody
     * @returns any The RSVP invitation email has been successfully sent.
     * @throws ApiError
     */
    public static emailNotificationControllerSendRsvpInvitation(
        requestBody: SendRsvpInvitationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/send-rsvp-invitation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Broadcast RSVP invitation emails to multiple guests
     * @param requestBody
     * @returns any The RSVP invitation emails have been processed.
     * @throws ApiError
     */
    public static emailNotificationControllerBroadcastRsvpInvitations(
        requestBody: BroadcastRsvpInvitationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/broadcast-rsvp-invitations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Generate an AI-powered email template
     * Uses AI to generate a custom HTML email template based on provided parameters. Returns both the HTML template and a suggested subject line.
     * @param weddingId
     * @param requestBody
     * @returns EmailTemplateResponse Email template successfully generated.
     * @throws ApiError
     */
    public static emailNotificationControllerGetAiEmailTemplate(
        weddingId: number,
        requestBody: GenerateAiEmailTemplateDto,
    ): CancelablePromise<EmailTemplateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/generate-ai-template/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Broadcast guest gratitude card emails to primary guests
     * @param weddingId
     * @returns any The guest gratitude card emails have been processed.
     * @throws ApiError
     */
    public static emailNotificationControllerBroadcastGuestGratitude(
        weddingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/broadcast-guest-gratitude/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Broadcast collaborator gratitude card emails to collaborators
     * @param weddingId
     * @returns any The collaborator gratitude card emails have been processed.
     * @throws ApiError
     */
    public static emailNotificationControllerBroadcastCollaboratorGratitude(
        weddingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/broadcast-collaborator-gratitude/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Broadcast vendor gratitude card emails to vendors
     * @param weddingId
     * @returns any The vendor gratitude card emails have been processed.
     * @throws ApiError
     */
    public static emailNotificationControllerBroadcastVendorGratitude(
        weddingId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email-notification/broadcast-vendor-gratitude/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
}
