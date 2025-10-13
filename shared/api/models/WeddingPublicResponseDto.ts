/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GuestMinimalDto } from './GuestMinimalDto';
export type WeddingPublicResponseDto = {
    /**
     * Wedding name
     */
    name: string;
    /**
     * PayNow QR code URL
     */
    paynowQR: string;
    /**
     * List of guests with minimal info
     */
    guests: Array<GuestMinimalDto>;
};

