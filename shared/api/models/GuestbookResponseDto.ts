/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuestbookNoteDto } from './GuestbookNoteDto';
export type GuestbookResponseDto = {
    /**
     * Microsite ID
     */
    id: number;
    /**
     * Wedding ID
     */
    weddingId: number;
    /**
     * Guestbook notes
     */
    guestNotes?: Array<GuestbookNoteDto>;
};

