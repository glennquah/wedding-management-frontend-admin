'use client';

import { useState } from 'react';

import { EmailNotificationService, GuestResponseDto } from '@shared/api';
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
import { toast } from 'sonner';

interface BroadcastRsvpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guests: GuestResponseDto[];
  weddingId: number;
}

export const BroadcastRsvpDialog = ({
  open,
  onOpenChange,
  guests,
  weddingId,
}: BroadcastRsvpDialogProps) => {
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<number>>(new Set());
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Handler for toggling guest selection
  const handleToggleGuest = (guestId: number) => {
    setSelectedGuestIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guestId)) {
        newSet.delete(guestId);
      } else {
        newSet.add(guestId);
      }
      return newSet;
    });
  };

  // Handler for selecting all guests
  const handleSelectAll = () => {
    if (selectedGuestIds.size === guests.length) {
      setSelectedGuestIds(new Set());
    } else {
      setSelectedGuestIds(new Set(guests.map((g) => g.id)));
    }
  };

  // Handler for broadcasting RSVP invitations
  const handleBroadcastRsvp = async () => {
    if (selectedGuestIds.size === 0) {
      toast.error('Please select at least one guest');
      return;
    }

    try {
      setIsBroadcasting(true);

      await EmailNotificationService.emailNotificationControllerBroadcastRsvpInvitations({
        weddingId,
        guestIds: Array.from(selectedGuestIds),
      });

      toast.success(
        `RSVP invitations sent to ${selectedGuestIds.size} guest${selectedGuestIds.size === 1 ? '' : 's'}!`,
      );
      onOpenChange(false);
      setSelectedGuestIds(new Set());
    } catch (error) {
      console.error('Error broadcasting RSVP invitations:', error);
      toast.error('Failed to send RSVP invitations. Please try again.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedGuestIds(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Broadcast RSVP Invitations</DialogTitle>
          <DialogDescription>
            Select guests to send RSVP invitation emails. All selected guests will receive their
            invitation to RSVP via email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-4 pb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedGuestIds.size === guests.length && guests.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Select All ({guests.length} guests)
                </label>
              </div>
              {selectedGuestIds.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedGuestIds.size} selected
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={`guest-${guest.id}`}
                  checked={selectedGuestIds.has(guest.id)}
                  onCheckedChange={() => handleToggleGuest(guest.id)}
                />
                <label
                  htmlFor={`guest-${guest.id}`}
                  className="flex-1 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{guest.name}</span>
                    <span className="text-sm text-muted-foreground">{guest.email}</span>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    {guest.group && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        {guest.group}
                      </span>
                    )}
                    {guest.accompanyingGuests && guest.accompanyingGuests.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +{guest.accompanyingGuests.length} guest
                        {guest.accompanyingGuests.length === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {guests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No guests available to send invitations.
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isBroadcasting}>
            Cancel
          </Button>
          <Button
            onClick={handleBroadcastRsvp}
            disabled={isBroadcasting || selectedGuestIds.size === 0}
          >
            {isBroadcasting
              ? 'Sending...'
              : `Send to ${selectedGuestIds.size} Guest${selectedGuestIds.size === 1 ? '' : 's'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
