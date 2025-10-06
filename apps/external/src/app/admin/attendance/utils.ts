import { GuestResponseDto } from '@shared/api';
import { AttendanceStats } from './types';

/**
 * Utility functions for the attendance page
 */

/**
 * Calculate attendance statistics from guest list
 */
export function calculateAttendanceStats(guests: GuestResponseDto[]): AttendanceStats {
  const totalConfirmed = guests.length;
  const present = guests.filter((g) => g.attendance).length;
  const notPresent = guests.filter((g) => !g.attendance).length;

  return {
    totalConfirmed,
    present,
    notPresent,
  };
}

/**
 * Get the count of accompanying guests for a primary guest
 */
export function getAccompanyingGuestCount(
  guests: GuestResponseDto[],
  primaryGuestId: number,
): number {
  return guests.filter((g) => g.primaryGuestId === primaryGuestId).length;
}
