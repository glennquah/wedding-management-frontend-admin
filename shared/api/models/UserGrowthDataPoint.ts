/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserGrowthDataPoint = {
    /**
     * Time period (YYYY-MM-DD or YYYY-MM)
     */
    period: string;
    /**
     * Number of new vendors in this period
     */
    vendorSignups: number;
    /**
     * Number of new couples in this period
     */
    coupleSignups: number;
    /**
     * Total signups (vendors + couples)
     */
    totalSignups: number;
    /**
     * Cumulative total users up to this period
     */
    cumulativeTotal: number;
};

