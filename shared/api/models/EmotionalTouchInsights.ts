/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonClusterItem } from './PersonClusterItem';
import type { PhotoItem } from './PhotoItem';
import type { WellWishItem } from './WellWishItem';
export type EmotionalTouchInsights = {
    /**
     * Total number of well-wishes and messages received
     */
    totalWellWishes: number;
    /**
     * List of all well wishes
     */
    wellWishes: Array<WellWishItem>;
    /**
     * Total number of photos uploaded
     */
    totalPhotos: number;
    /**
     * List of all photo URLs with face counts
     */
    photos: Array<PhotoItem>;
    /**
     * Total number of faces detected in photos
     */
    totalFacesDetected: number;
    /**
     * Total number of unique people identified
     */
    totalPeopleClusters: number;
    /**
     * Person who appeared most frequently in photos
     */
    mostFrequentPersonName: string | null;
    /**
     * Number of times the most frequent person appeared
     */
    mostFrequentPersonCount: number | null;
    /**
     * Sample photo URL of the most frequent person
     */
    mostFrequentPersonPhoto: string | null;
    /**
     * List of all person clusters with appearance counts
     */
    personClusters: Array<PersonClusterItem>;
};

