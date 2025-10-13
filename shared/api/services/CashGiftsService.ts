/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CashGiftResponseDto } from '../models/CashGiftResponseDto';
import type { CreateCashGiftDto } from '../models/CreateCashGiftDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CashGiftsService {
    /**
     * Create a new cash gift record for a wedding (public endpoint)
     * @param requestBody
     * @returns CashGiftResponseDto The cash gift record has been successfully created.
     * @throws ApiError
     */
    public static cashGiftControllerCreate(
        requestBody: CreateCashGiftDto,
    ): CancelablePromise<CashGiftResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cash-gifts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Wedding or guest not found.`,
            },
        });
    }
    /**
     * Get all cash gifts for a specific wedding
     * @param weddingId
     * @returns CashGiftResponseDto List of cash gifts for the wedding
     * @throws ApiError
     */
    public static cashGiftControllerGetCashGiftsByWedding(
        weddingId: number,
    ): CancelablePromise<Array<CashGiftResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cash-gifts/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
        });
    }
    /**
     * Get a cash gift by ID
     * @param id
     * @returns CashGiftResponseDto The cash gift details
     * @throws ApiError
     */
    public static cashGiftControllerGetCashGift(
        id: number,
    ): CancelablePromise<CashGiftResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cash-gifts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Cash gift not found.`,
            },
        });
    }
    /**
     * Delete a cash gift record
     * @param id
     * @returns any The cash gift record has been successfully deleted.
     * @throws ApiError
     */
    public static cashGiftControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cash-gifts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Cash gift not found.`,
            },
        });
    }
}
