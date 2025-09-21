/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendBulkEmailDto = {
    /**
     * Array of recipient email addresses
     */
    emails: Array<string>;
    subject: string;
    text: string;
    html: string;
    weddingId: number;
};

