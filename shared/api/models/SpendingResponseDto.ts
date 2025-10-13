/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SpendingResponseDto = {
    /**
     * Total amount spent on orders
     */
    totalSpending: number;
    /**
     * Allocated budget for the wedding
     */
    allocatedBudget: number;
    /**
     * Current spending from the wedding record
     */
    currentSpending: number;
    /**
     * Remaining budget
     */
    remainingBudget: number;
    /**
     * Percentage of budget used
     */
    budgetUsedPercentage: number;
    /**
     * Number of orders placed
     */
    orderCount: number;
    /**
     * Currency used
     */
    currency: string;
};

