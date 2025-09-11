/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSuperAdminDto = {
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
    /**
     * Role of the user
     */
    role: CreateSuperAdminDto.role;
};
export namespace CreateSuperAdminDto {
    /**
     * Role of the user
     */
    export enum role {
        ADMIN = 'admin',
        SUPER_ADMIN = 'superAdmin',
        VENDOR = 'vendor',
    }
}

