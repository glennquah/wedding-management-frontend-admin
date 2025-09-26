/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfirmationStatus } from './ConfirmationStatus';

export type GuestResponseDto = {
  /**
   * Guest ID
   */
  id: number;
  /**
   * The name of the guest
   */
  name: string;
  /**
   * The email of the guest
   */
  email: string;
  /**
   * Allergies or dietary restrictions
   */
  allergies?: string;
  /**
   * Group identifier for the guest
   */
  group?: string;
  /**
   * Wedding ID this guest belongs to
   */
  weddingId: number;
  /**
   * Wedding name this guest belongs to
   */
  weddingName: string;
  /**
   * Primary guest ID if this is an accompanying guest
   */
  primaryGuestId?: number;
  confirmationStatus: ConfirmationStatus;
  /**
   * List of accompanying guests
   */
  accompanyingGuests?: Array<GuestResponseDto>;
  /**
   * Creation timestamp
   */
  createdAt: string;
  /**
   * Last update timestamp
   */
  updatedAt: string;
};
