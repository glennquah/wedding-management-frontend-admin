'use client';

import { useState } from 'react';

import { EmailNotificationService } from '@shared/api';
import { Button } from '@shared/components/ui/button';
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
  weddingId: number;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const BroadcastCollaboratorGratitudeDialog = ({
  open,
  weddingId,
  onOpenChange,
  onComplete,
}: BroadcastRsvpDialogProps) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Handler for broadcasting collaborator gratitude cards
  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    try {
      await EmailNotificationService.emailNotificationControllerBroadcastCollaboratorGratitude(
        weddingId,
      );

      toast.success('Collaborator gratitude cards sent to collaborators!');
      onOpenChange(false);
      onComplete?.();
    } catch (error) {
      console.error('Error broadcasting collaborator gratitude cards:', error);
      toast.error('Failed to send collaborator gratitude cards. Please try again.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="text-center">
          <DialogTitle>Broadcast Gratitude Cards</DialogTitle>
          <DialogDescription>
            All collaborators of the wedding will receive a personalised gratitude card via email.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 justify-between">
          <Button onClick={handleCancel} disabled={isBroadcasting}>
            Cancel
          </Button>
          <Button onClick={handleBroadcast} disabled={isBroadcasting}>
            {isBroadcasting ? 'Sending...' : 'Send to Collaborators'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
