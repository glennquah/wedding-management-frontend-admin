/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlanningJourneyInsights = {
    /**
     * Number of days spent planning the wedding
     */
    planningDays: number;
    /**
     * Vendor category with highest spending
     */
    topVendorCategory: PlanningJourneyInsights.topVendorCategory | null;
    /**
     * Amount spent on top vendor category
     */
    topVendorAmount: number | null;
    /**
     * Budget utilization percentage
     */
    budgetUtilization: number;
    /**
     * Total amount spent
     */
    totalSpent: number;
    /**
     * Initially allocated budget
     */
    allocatedBudget: number;
};
export namespace PlanningJourneyInsights {
    /**
     * Vendor category with highest spending
     */
    export enum topVendorCategory {
        VENUE = 'VENUE',
        CATERING = 'CATERING',
        PHOTOGRAPHY = 'PHOTOGRAPHY',
        DECORATION = 'DECORATION',
        MUSIC = 'MUSIC',
        ATTIRE = 'ATTIRE',
        MAKEUP = 'MAKEUP',
        TRANSPORTATION = 'TRANSPORTATION',
    }
}

