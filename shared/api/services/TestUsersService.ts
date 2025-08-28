/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTestUserDto } from '../models/CreateTestUserDto';
import type { TestUserResponseDto } from '../models/TestUserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TestUsersService {
    /**
     * Create a new test user
     * @param requestBody
     * @returns TestUserResponseDto The test user has been successfully created.
     * @throws ApiError
     */
    public static testUserControllerCreate(
        requestBody: CreateTestUserDto,
    ): CancelablePromise<TestUserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/test-users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
}
