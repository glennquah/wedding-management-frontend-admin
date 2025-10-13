/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AlbumResponseDto = {
    /**
     * Album ID
     */
    id: number;
    /**
     * Associated wedding ID
     */
    weddingId: number;
    /**
     * Couple name
     */
    coupleName: string;
    /**
     * Custom invite card message
     */
    inviteCardMessage: string;
    /**
     * Custom landing message in album
     */
    landingMessage: string;
    /**
     * Cloudinary album URL
     */
    albumURL?: string;
    /**
     * Array of Cloudinary image URLs for the photo gallery
     */
    photos?: Array<string>;
};

