/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GratitudeCardResponseDto = {
    /**
     * Gratitude Card ID
     */
    id: number;
    /**
     * Associated wedding ID
     */
    weddingId: number;
    /**
     * Couple sign off name
     */
    signOffName: string;
    /**
     * Custom guest card message
     */
    guestCardMessage?: string;
    /**
     * Custom collaborator card message
     */
    collaboratorCardMessage?: string;
    /**
     * Custom vendor card message
     */
    vendorCardMessage?: string;
    /**
     * Guest card main photo URL
     */
    guestCardPhotoURL?: string;
    /**
     * Collaborator card main photo URL
     */
    collaboratorCardPhotoURL?: string;
};

