/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateVendorDto } from '../models/CreateVendorDto';
import type { UpdateVendorDto } from '../models/UpdateVendorDto';
import type { VendorResponseDto } from '../models/VendorResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VendorsService {
    /**
     * Create a new vendor
     * @param requestBody
     * @returns VendorResponseDto The vendor has been successfully created.
     * @throws ApiError
     */
    public static vendorControllerCreate(
        requestBody: CreateVendorDto,
    ): CancelablePromise<VendorResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendors',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                409: `Vendor with this email already exists.`,
            },
        });
    }
    /**
     * Get all vendors
     * @returns VendorResponseDto List of all vendors
     * @throws ApiError
     */
    public static vendorControllerGetAllVendors(): CancelablePromise<Array<VendorResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors',
        });
    }
    /**
     * Create multiple vendors
     * @param requestBody
     * @returns VendorResponseDto The vendors have been successfully created.
     * @throws ApiError
     */
    public static vendorControllerCreateMultiple(
        requestBody: Array<string>,
    ): CancelablePromise<Array<VendorResponseDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendors/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
            },
        });
    }
    /**
     * Get a vendor by ID
     * @param id
     * @returns VendorResponseDto The vendor details
     * @throws ApiError
     */
    public static vendorControllerGetVendor(
        id: number,
    ): CancelablePromise<VendorResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Vendor not found.`,
            },
        });
    }
    /**
     * Update a vendor
     * @param id
     * @param requestBody
     * @returns VendorResponseDto The vendor has been successfully updated.
     * @throws ApiError
     */
    public static vendorControllerUpdate(
        id: number,
        requestBody: UpdateVendorDto,
    ): CancelablePromise<VendorResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vendors/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request.`,
                404: `Vendor not found.`,
                409: `Vendor with this email already exists.`,
            },
        });
    }
    /**
     * Delete a vendor
     * @param id
     * @returns any The vendor has been successfully deleted.
     * @throws ApiError
     */
    public static vendorControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vendors/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Vendor not found.`,
            },
        });
    }
    /**
     * Get a vendor by email
     * @param email
     * @returns VendorResponseDto The vendor details
     * @throws ApiError
     */
    public static vendorControllerGetVendorByEmail(
        email: string,
    ): CancelablePromise<VendorResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/email/{email}',
            path: {
                'email': email,
            },
            errors: {
                404: `Vendor not found.`,
            },
        });
    }
}
