/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type CreateAdminDto = {
    /**
     * The name of the user
     */
    name: string;
    /**
     * Email address of the user
     */
    email: string;
    /**
     * Password for the user account
     */
    password: string;
    role: UserRole;
    /**
     * Is the admin a couple?
     */
    isCouple: boolean;
    /**
     * Wedding ID to associate with this admin
     */
    weddingId: number;
};

