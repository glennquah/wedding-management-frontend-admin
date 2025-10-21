/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGuestbookNoteDto } from '../models/CreateGuestbookNoteDto';
import type { GuestbookResponseDto } from '../models/GuestbookResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GuestbookService {
    /**
     * Create guestbook for a wedding
     * @param weddingId
     * @param requestBody
     * @returns GuestbookResponseDto Guestbook created successfully.
     * @throws ApiError
     */
    public static guestbookControllerAddGuestNote(
        weddingId: number,
        requestBody: CreateGuestbookNoteDto,
    ): CancelablePromise<GuestbookResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guestbook/{weddingId}/add',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Wedding already has a guestbook.`,
            },
        });
    }
    /**
     * Get guestbook by wedding ID
     * @param weddingId
     * @returns GuestbookResponseDto Guestbook retrieved successfully.
     * @throws ApiError
     */
    public static guestbookControllerGetGuestbookByWeddingId(
        weddingId: number,
    ): CancelablePromise<GuestbookResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guestbook/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get guestbook by guestbook ID
     * @param guestbookId
     * @returns GuestbookResponseDto Guestbook retrieved successfully.
     * @throws ApiError
     */
    public static guestbookControllerGetGuestbookByGuestbookId(
        guestbookId: number,
    ): CancelablePromise<GuestbookResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guestbook/{guestbookId}',
            path: {
                'guestbookId': guestbookId,
            },
            errors: {
                404: `Guestbook not found.`,
            },
        });
    }
}
