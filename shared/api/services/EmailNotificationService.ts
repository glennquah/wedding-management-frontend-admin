/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
}
