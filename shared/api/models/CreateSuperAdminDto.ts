/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type CreateSuperAdminDto = {
    /**
     * The name of the super admin
     */
    name: string;
    /**
     * Email address of the super admin
     */
    email: string;
    /**
     * Password for the super admin account
     */
    password?: string;
    role: UserRole;
};

