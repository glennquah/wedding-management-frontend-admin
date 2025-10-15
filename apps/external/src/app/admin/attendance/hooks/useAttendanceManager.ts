import { GuestResponseDto, GuestsService } from '@shared/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

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
      const results = await Promise.all(
        Array.from(attendanceChanges).map(async (guestId) => {
          // Find the guest to determine if we're marking present or absent
          const guest = confirmedGuests.find((g) => g.id === guestId);
          if (!guest) return null;

          const isMarkingPresent = !guest.attendance;

          // First toggle attendance
          await GuestsService.guestControllerMarkAttendance(guestId);

          // Then update checkInTime accordingly
          if (isMarkingPresent) {
            await GuestsService.guestControllerCheckIn(guestId);
          } else {
            await GuestsService.guestControllerRemoveCheckIn(guestId);
          }

          return { isMarkingPresent, guestName: guest.name };
        }),
      );

      // Count successful changes
      const successfulChanges = results.filter((result) => result !== null).length;

      // Show single success toast
      if (successfulChanges > 0) {
        toast.success(
          `Successfully updated attendance for ${successfulChanges} guest${successfulChanges === 1 ? '' : 's'}`
        );
      }

      setAttendanceChanges(new Set());
      setShowConfirmDialog(false);
      await fetchGuests();
    } catch (error) {
      console.error('Failed to apply attendance changes:', error);
      toast.error('Failed to update attendance');
    } finally {
      setIsApplyingChanges(false);
    }
  }, [attendanceChanges, fetchGuests, confirmedGuests]);

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

    // Handlers
    handleToggleAttendance,
    hasAttendanceChange,
    handleApplyChanges,
    openConfirmDialog,
    closeConfirmDialog,
  };
}
