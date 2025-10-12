/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateGratitudeCardDto = {
    /**
     * Wedding ID to associate with the gratitude cards
     */
    weddingId: number;
    /**
     * Card recipeint
     */
    recipient: string;
    /**
     * Couple sign off name for the cards
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

