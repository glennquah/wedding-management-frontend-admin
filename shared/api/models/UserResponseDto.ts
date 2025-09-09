/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponseDto = {
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
    /**
     * Role of the user
     */
    role: UserResponseDto.role;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
};
export namespace UserResponseDto {
    /**
     * Role of the user
     */
    export enum role {
        ADMIN = 'admin',
        SUPER_ADMIN = 'superAdmin',
        VENDOR = 'vendor',
    }
}

