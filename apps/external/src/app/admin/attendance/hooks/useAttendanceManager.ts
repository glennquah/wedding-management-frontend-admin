import { GuestResponseDto, GuestsService } from '@shared/api';
import { useCallback, useState } from 'react';
import { AccompanyingDialogState } from '../types';

/**
 * Custom hook to manage attendance state and operations
 */
export function useAttendanceManager(
  confirmedGuests: GuestResponseDto[],
  fetchGuests: () => Promise<void>,
) {
  const [attendanceChanges, setAttendanceChanges] = useState<Set<number>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [accompanyingGuestDialog, setAccompanyingGuestDialog] = useState<AccompanyingDialogState>({
    open: false,
    guests: [],
  });

  // Toggle attendance for a guest (optimistic update)
  const handleToggleAttendance = useCallback((guest: GuestResponseDto) => {
    setAttendanceChanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guest.id)) {
        newSet.delete(guest.id);
      } else {
        newSet.add(guest.id);
      }
      return newSet;
    });
  }, []);

  // Check if a guest has a pending attendance change
  const hasAttendanceChange = useCallback(
    (guestId: number) => attendanceChanges.has(guestId),
    [attendanceChanges],
  );

  // Apply attendance changes to backend
  const handleApplyChanges = useCallback(async () => {
    setIsApplyingChanges(true);
    try {
      await Promise.all(
        Array.from(attendanceChanges).map((guestId) =>
          GuestsService.guestControllerMarkAttendance(guestId),
        ),
      );
      setAttendanceChanges(new Set());
      setShowConfirmDialog(false);
      await fetchGuests();
    } catch (error) {
      console.error('Failed to apply attendance changes:', error);
    } finally {
      setIsApplyingChanges(false);
    }
  }, [attendanceChanges, fetchGuests]);

  // Open accompanying guest attendance dialog
  const handleOpenAccompanyingGuestDialog = useCallback(
    (primaryGuestId: number) => {
      const accompanyingGuestsList = confirmedGuests.filter(
        (g) => g.primaryGuestId === primaryGuestId,
      );
      setAccompanyingGuestDialog({
        open: true,
        guests: accompanyingGuestsList,
      });
    },
    [confirmedGuests],
  );

  // Close accompanying guest attendance dialog
  const handleCloseAccompanyingGuestDialog = useCallback(() => {
    setAccompanyingGuestDialog({ open: false, guests: [] });
  }, []);

  // Apply accompanying guest attendance changes
  const handleApplyAccompanyingGuestChanges = useCallback(
    async (guestIds: number[]) => {
      setIsApplyingChanges(true);
      try {
        await Promise.all(
          guestIds.map((guestId) => GuestsService.guestControllerMarkAttendance(guestId)),
        );
        handleCloseAccompanyingGuestDialog();
        await fetchGuests();
      } catch (error) {
        console.error('Failed to apply accompanying guest attendance changes:', error);
      } finally {
        setIsApplyingChanges(false);
      }
    },
    [fetchGuests, handleCloseAccompanyingGuestDialog],
  );

  // Show confirm dialog
  const openConfirmDialog = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  // Hide confirm dialog
  const closeConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  return {
    // State
    attendanceChanges,
    showConfirmDialog,
    isApplyingChanges,
    accompanyingGuestDialog,

    // Handlers
    handleToggleAttendance,
    hasAttendanceChange,
    handleApplyChanges,
    handleOpenAccompanyingGuestDialog,
    handleCloseAccompanyingGuestDialog,
    handleApplyAccompanyingGuestChanges,
    openConfirmDialog,
    closeConfirmDialog,
  };
}
