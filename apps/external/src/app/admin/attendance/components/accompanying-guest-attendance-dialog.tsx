import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { GuestResponseDto } from '@shared/api';
import React, { useCallback, useState } from 'react';

/**
 * Props for the AccompanyingGuestAttendanceDialog component
 */
interface AccompanyingGuestAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accompanyingGuests: GuestResponseDto[];
  onApplyChanges: (guestIds: number[]) => void;
  isApplying: boolean;
}

/**
 * Calculate displayed attendance state based on current state and pending changes
 */
const getDisplayedAttendanceState = (
  currentAttendance: boolean,
  hasPendingChange: boolean,
): boolean => {
  return hasPendingChange ? !currentAttendance : currentAttendance;
};

/**
 * Guest row component for the dialog
 */
interface GuestRowProps {
  guest: GuestResponseDto;
  isChecked: boolean;
  onToggle: (guestId: number) => void;
}

const GuestRow = React.memo<GuestRowProps>(({ guest, isChecked, onToggle }) => {
  const handleToggle = useCallback(() => {
    onToggle(guest.id);
  }, [guest.id, onToggle]);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
      <div className="flex-1">
        <p className="font-medium text-foreground">{guest.name}</p>
        {guest.allergies && (
          <p className="text-xs text-muted-foreground mt-1">Dietary: {guest.allergies}</p>
        )}
      </div>
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleToggle}
        aria-label={`Mark attendance for ${guest.name}`}
        className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
      />
    </div>
  );
});
GuestRow.displayName = 'GuestRow';

/**
 * Empty state component
 */
const EmptyState = React.memo(() => (
  <p className="text-sm text-muted-foreground text-center py-4">No accompanying guests found.</p>
));
EmptyState.displayName = 'EmptyState';

/**
 * Dialog for marking attendance of accompanying guests
 * Manages local state for pending changes before applying to backend
 */
export const AccompanyingGuestAttendanceDialog = React.memo<AccompanyingGuestAttendanceDialogProps>(
  ({ open, onOpenChange, accompanyingGuests, onApplyChanges, isApplying }) => {
    const [localAttendanceChanges, setLocalAttendanceChanges] = useState<Set<number>>(new Set());

    // Reset local changes when dialog closes
    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        if (!newOpen) {
          setLocalAttendanceChanges(new Set());
        }
        onOpenChange(newOpen);
      },
      [onOpenChange],
    );

    // Toggle attendance for an accompanying guest
    const handleToggleAttendance = useCallback((guestId: number) => {
      setLocalAttendanceChanges((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(guestId)) {
          newSet.delete(guestId);
        } else {
          newSet.add(guestId);
        }
        return newSet;
      });
    }, []);

    // Apply changes handler
    const handleApply = useCallback(() => {
      if (localAttendanceChanges.size > 0) {
        onApplyChanges(Array.from(localAttendanceChanges));
        setLocalAttendanceChanges(new Set());
      }
    }, [localAttendanceChanges, onApplyChanges]);

    // Cancel handler
    const handleCancel = useCallback(() => {
      handleOpenChange(false);
    }, [handleOpenChange]);

    // Calculate button text
    const applyButtonText = isApplying
      ? 'Applying...'
      : `Apply Changes${localAttendanceChanges.size > 0 ? ` (${localAttendanceChanges.size})` : ''}`;

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Accompanying Guest Attendance</DialogTitle>
            <DialogDescription>
              Mark the attendance for accompanying guests. Click the checkbox to toggle attendance
              status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {accompanyingGuests.length === 0 ? (
              <EmptyState />
            ) : (
              accompanyingGuests.map((guest) => {
                const hasPendingChange = localAttendanceChanges.has(guest.id);
                const currentAttendance = guest.attendance || false;
                const displayedState = getDisplayedAttendanceState(
                  currentAttendance,
                  hasPendingChange,
                );

                return (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    isChecked={displayedState}
                    onToggle={handleToggleAttendance}
                  />
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isApplying}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={localAttendanceChanges.size === 0 || isApplying}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              {applyButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

AccompanyingGuestAttendanceDialog.displayName = 'AccompanyingGuestAttendanceDialog';
