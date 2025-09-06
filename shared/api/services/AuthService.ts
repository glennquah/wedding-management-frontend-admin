/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { CreateVendorDto } from '../models/CreateVendorDto';
import type { LoginDto } from '../models/LoginDto';
import type { VendorResponseDto } from '../models/VendorResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Create a new vendor
     * @param requestBody
     * @returns VendorResponseDto The test user has been successfully created.
     * @throws ApiError
     */
    public static authControllerRegisterTestUser(
        requestBody: CreateVendorDto,
    ): CancelablePromise<VendorResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register/vendor',
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
     * Refresh JWT token
     * @returns AuthResponseDto The JWT token has been refreshed.
     * @throws ApiError
     */
    public static authControllerRefreshToken(): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
        });
    }
}
