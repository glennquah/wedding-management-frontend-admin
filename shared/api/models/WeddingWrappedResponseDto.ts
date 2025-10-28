/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmotionalTouchInsights } from './EmotionalTouchInsights';
import type { GiftSupportInsights } from './GiftSupportInsights';
import type { GuestInsights } from './GuestInsights';
import type { PlanningJourneyInsights } from './PlanningJourneyInsights';
export type WeddingWrappedResponseDto = {
    /**
     * Wedding Wrapped snapshot ID
     */
    id: number;
    /**
     * Wedding ID
     */
    weddingId: number;
    /**
     * Guest experience insights
     */
    guestInsights: GuestInsights;
    /**
     * Gift and support insights
     */
    giftSupportInsights: GiftSupportInsights;
    /**
     * Planning journey insights
     */
    planningJourneyInsights: PlanningJourneyInsights;
    /**
     * Emotional touch insights
     */
    emotionalTouchInsights: EmotionalTouchInsights;
    /**
     * When this Wedding Wrapped snapshot was generated
     */
    generatedAt: string;
    /**
     * When this record was created
     */
    createdAt: string;
    /**
     * When this record was last updated
     */
    updatedAt: string;
};

