/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type SuperAdminResponseDto = {
    /**
     * User ID
     */
    id: number;
    /**
     * The name of the user
     */
    name: string;
    /**
     * Email address of the user
     */
    email: string;
    role: UserRole;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
    /**
     * Is the user suspended?
     */
    isSuspended?: boolean;
};

