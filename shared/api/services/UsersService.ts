/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get all users (admins, vendors, superAdmins)
     * @returns UserResponseDto Successfully retrieved all users
     * @throws ApiError
     */
    public static userControllerGetAllUsers(): CancelablePromise<Array<UserResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
        });
    }
}
