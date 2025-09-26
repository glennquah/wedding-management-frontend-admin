/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminResponseDto } from '../models/AdminResponseDto';
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { CreateAdminDto } from '../models/CreateAdminDto';
import type { CreateVendorDto } from '../models/CreateVendorDto';
import type { LoginDto } from '../models/LoginDto';
import type { RequestResetPasswordDto } from '../models/RequestResetPasswordDto';
import type { ResetPasswordDto } from '../models/ResetPasswordDto';
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
    public static authControllerRegisterVendor(
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
     * Create a new admin
     * @param requestBody
     * @returns AdminResponseDto The admin has been successfully created.
     * @throws ApiError
     */
    public static authControllerRegisterAdmin(
        requestBody: CreateAdminDto,
    ): CancelablePromise<AdminResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register/admin',
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
     * @returns AuthResponseDto The user has been successfully logged in.
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<AuthResponseDto> {
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
    /**
     * Request password reset
     * Sends a password reset email to the user.
     * @param requestBody
     * @returns any Password reset email sent successfully.
     * @throws ApiError
     */
    public static authControllerRequestPasswordReset(
        requestBody: RequestResetPasswordDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/request-password-reset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Reset password
     * Allows a user to reset their password using a valid token.
     * @param requestBody
     * @returns any Password reset successfully.
     * @throws ApiError
     */
    public static authControllerResetPassword(
        requestBody: ResetPasswordDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid or expired token.`,
            },
        });
    }
}
