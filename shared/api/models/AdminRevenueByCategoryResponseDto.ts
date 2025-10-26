/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryRevenueData } from './CategoryRevenueData';
export type AdminRevenueByCategoryResponseDto = {
    /**
     * Revenue breakdown by category
     */
    categories: Array<CategoryRevenueData>;
    /**
     * Total revenue across all categories
     */
    totalRevenue: number;
    /**
     * Currency code
     */
    currency: string;
};

