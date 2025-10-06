import { ConfirmationStatus, CreateGuestDto, GuestResponseDto } from '@shared/api';

/**
 * Type definitions for the attendance page
 */

export interface AccompanyingGuestData {
  name: string;
  allergies?: string;
  confirmationStatus: ConfirmationStatus;
}

export type GuestFormData = Partial<CreateGuestDto> & {
  id?: number;
  accompanyingGuests?: AccompanyingGuestData[];
};

export interface AttendanceStats {
  totalConfirmed: number;
  present: number;
  notPresent: number;
}

export interface AccompanyingDialogState {
  open: boolean;
  guests: GuestResponseDto[];
}

export interface CapacityInfo {
  limit: number;
  current: number;
  available: number;
  isAtCapacity: boolean;
}
