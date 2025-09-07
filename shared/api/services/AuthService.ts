/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTestUserDto } from '../models/CreateTestUserDto';
import type { LoginDto } from '../models/LoginDto';
import type { TestUserResponseDto } from '../models/TestUserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Create a new test user
     * @param requestBody
     * @returns TestUserResponseDto The test user has been successfully created.
     * @throws ApiError
     */
    public static authControllerRegisterTestUser(
        requestBody: CreateTestUserDto,
    ): CancelablePromise<TestUserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Login user
     * @param requestBody
     * @returns any The user has been successfully logged in.
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized.`,
            },
        });
    }
    /**
     * Login user
     * @returns any The JWT token has been refreshed.
     * @throws ApiError
     */
    public static authControllerRefreshToken(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
        });
    }
}
