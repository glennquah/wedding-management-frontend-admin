/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type UpdateAdminDto = {
    /**
     * The name of the user
     */
    name?: string;
    /**
     * Email address of the user
     */
    email?: string;
    /**
     * Password for the user account
     */
    password?: string;
    role: UserRole;
    /**
     * Is the admin a couple?
     */
    isCouple?: boolean;
    /**
     * Is the admin suspended?
     */
    isSuspended?: boolean;
    /**
     * Date when the admin was onboarded
     */
    onboardedDate?: string;
    /**
     * Wedding type
     */
    weddingType?: UpdateAdminDto.weddingType;
    /**
     * Budget bucket
     */
    budgetBucket?: UpdateAdminDto.budgetBucket;
    /**
     * Guest count bucket
     */
    guestCountBucket?: UpdateAdminDto.guestCountBucket;
    /**
     * Preferred wedding style
     */
    preferredStyle?: UpdateAdminDto.preferredStyle;
    /**
     * Preferred wedding services
     */
    preferredServices?: Array<'venue' | 'catering' | 'photography' | 'decoration' | 'music' | 'attire' | 'makeup' | 'transportation'>;
};
export namespace UpdateAdminDto {
    /**
     * Wedding type
     */
    export enum weddingType {
        CHINESE = 'chinese',
        MALAY = 'malay',
        INDIAN = 'indian',
        WESTERN = 'western',
        OTHERS = 'others',
    }
    /**
     * Budget bucket
     */
    export enum budgetBucket {
        LOW = 'low',
        MEDIUM = 'medium',
        HIGH = 'high',
        LUXURY = 'luxury',
    }
    /**
     * Guest count bucket
     */
    export enum guestCountBucket {
        SMALL = 'small',
        MEDIUM = 'medium',
        LARGE = 'large',
    }
    /**
     * Preferred wedding style
     */
    export enum preferredStyle {
        LUXURY = 'luxury',
        MODERN = 'modern',
        TRADITIONAL = 'traditional',
        RUSTIC = 'rustic',
    }
}

