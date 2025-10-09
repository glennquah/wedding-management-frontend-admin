/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateAlbumDto = {
    /**
     * Wedding ID to associate with the microsite
     */
    weddingId: number;
    /**
     * Couple name for the album
     */
    coupleName?: string;
    /**
     * Custom invite card message
     */
    inviteCardMessage?: string;
    /**
     * Custom landing message in album
     */
    landingMessage?: string;
    /**
     * Cloudinary album URL
     */
    albumURL?: string;
    /**
     * Array of Cloudinary image URLs for the photo gallery
     */
    photos?: Array<string>;
    /**
     * Uploaded photo cloudinary URL
     */
    photoUrl?: string;
};

