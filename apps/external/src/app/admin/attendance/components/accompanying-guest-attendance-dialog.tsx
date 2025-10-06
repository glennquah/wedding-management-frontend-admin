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
import { GuestResponseDto } from '@wedding/api-types';
import { useState } from 'react';

interface AccompanyingGuestAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accompanyingGuests: GuestResponseDto[];
  onApplyChanges: (guestIds: number[]) => void;
  isApplying: boolean;
}

export function AccompanyingGuestAttendanceDialog({
  open,
  onOpenChange,
  accompanyingGuests,
  onApplyChanges,
  isApplying,
}: AccompanyingGuestAttendanceDialogProps) {
  // Track local attendance changes within the dialog
  const [localAttendanceChanges, setLocalAttendanceChanges] = useState<Set<number>>(new Set());

  // Reset local changes when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setLocalAttendanceChanges(new Set());
    }
    onOpenChange(newOpen);
  };

  // Toggle attendance for an accompanying guest
  const handleToggleAttendance = (guestId: number) => {
    setLocalAttendanceChanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guestId)) {
        newSet.delete(guestId);
      } else {
        newSet.add(guestId);
      }
      return newSet;
    });
  };

  // Check if guest has attendance change pending
  const hasAttendanceChange = (guestId: number) => localAttendanceChanges.has(guestId);

  // Get the displayed attendance state for a guest
  const getDisplayedState = (guest: GuestResponseDto) => {
    const hasPendingChange = hasAttendanceChange(guest.id);
    const currentAttendance = guest.attendance || false;
    return hasPendingChange ? !currentAttendance : currentAttendance;
  };

  // Apply changes handler
  const handleApply = () => {
    if (localAttendanceChanges.size > 0) {
      onApplyChanges(Array.from(localAttendanceChanges));
      setLocalAttendanceChanges(new Set());
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Accompanying Guest Attendance</DialogTitle>
          <DialogDescription>
            Mark the attendance for accompanying guests. Click the checkbox to toggle attendance status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {accompanyingGuests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No accompanying guests found.
            </p>
          ) : (
            accompanyingGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{guest.name}</p>
                  {guest.allergies && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Dietary: {guest.allergies}
                    </p>
                  )}
                </div>
                <Checkbox
                  checked={getDisplayedState(guest)}
                  onCheckedChange={() => handleToggleAttendance(guest.id)}
                  aria-label={`Mark attendance for ${guest.name}`}
                  className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isApplying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={localAttendanceChanges.size === 0 || isApplying}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isApplying ? 'Applying...' : `Apply Changes${localAttendanceChanges.size > 0 ? ` (${localAttendanceChanges.size})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
