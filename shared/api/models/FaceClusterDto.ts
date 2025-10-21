/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FaceClusterDto = {
    /**
     * Unique identifier for the face cluster
     */
    id: number;
    /**
     * Optional label for the cluster (e.g., "Bride", "Groom")
     */
    label?: string;
    /**
     * Number of faces in this cluster
     */
    faceCount: number;
    /**
     * URL of a sample photo for thumbnail display
     */
    thumbnailUrl?: string;
    /**
     * Array of photo IDs containing faces from this cluster
     */
    photoIds: Array<number>;
};

