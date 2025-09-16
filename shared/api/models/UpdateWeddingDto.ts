/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateWeddingDto = {
    /**
     * The name of the wedding
     */
    name?: string;
    /**
     * Wedding date
     */
    date?: string;
    /**
     * Wedding location
     */
    location?: string;
    /**
     * Wedding type
     */
    weddingType?: UpdateWeddingDto.weddingType;
    /**
     * Budget bucket
     */
    budgetBucket?: UpdateWeddingDto.budgetBucket;
    /**
     * Guest count bucket
     */
    guestCountBucket?: UpdateWeddingDto.guestCountBucket;
    /**
     * Preferred wedding style
     */
    preferredStyle?: UpdateWeddingDto.preferredStyle;
    /**
     * Preferred wedding services
     */
    preferredServices?: Array<'venue' | 'catering' | 'photography' | 'decoration' | 'music' | 'attire' | 'makeup' | 'transportation'>;
};
export namespace UpdateWeddingDto {
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

