/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserGrowthDataPoint } from './UserGrowthDataPoint';
export type AdminUserGrowthResponseDto = {
    /**
     * User growth data over time
     */
    data: Array<UserGrowthDataPoint>;
    /**
     * Period type (MONTHLY, YEARLY, ALL)
     */
    periodType: string;
    /**
     * Total vendors currently
     */
    totalVendors: number;
    /**
     * Total couples currently
     */
    totalCouples: number;
};

