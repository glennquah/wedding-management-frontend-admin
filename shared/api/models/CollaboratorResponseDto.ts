/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CollaboratorResponseDto = {
    /**
     * User ID of the collaborator
     */
    id: number;
    /**
     * Name of the collaborator
     */
    name: string;
    /**
     * Email of the collaborator
     */
    email: string;
    /**
     * Whether the account was newly created or existing
     */
    accountCreated: boolean;
    /**
     * Whether an existing account was found
     */
    existingAccount: boolean;
};

