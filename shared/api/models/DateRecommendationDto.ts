/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DateRecommendationDto = {
    /**
     * Recommended date in YYYY-MM-DD format
     */
    date: string;
    /**
     * Day of the week
     */
    day_of_week: string;
    /**
     * Overall desirability score (0-100)
     */
    total_score: number;
    /**
     * Number of key attendees available
     */
    available_attendees_count: number;
    /**
     * Total number of key attendees (excluding main couple)
     */
    total_attendees_count: number;
    /**
     * Names of unavailable key attendees
     */
    unavailable_attendees: Array<string>;
    /**
     * Breakdown of scores by factor
     */
    score_breakdown: Record<string, any>;
    /**
     * Advantages of this date
     */
    pros: Array<string>;
    /**
     * Disadvantages of this date
     */
    cons: Array<string>;
};

