'use client';

import { useState } from 'react';

import { GuestResponseDto } from '@shared/api';
import { Button } from '@shared/components';
import { Badge } from '@shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { Input } from '@shared/components/ui/form/input';

interface GuestSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: GuestResponseDto[];
  onSelectGuest: (guest: GuestResponseDto) => void;
  excludedGuestIds?: number[];
}

export function GuestSearchModal({
  isOpen,
  onClose,
  guests,
  onSelectGuest,
  excludedGuestIds = [],
}: GuestSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter guests based on search query
  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleSelectGuest = (guest: GuestResponseDto) => {
    onSelectGuest(guest);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Key Attendee</DialogTitle>
          <DialogDescription>
            Select guests whose availability is critical for your wedding date
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No guests found</p>
              <p className="text-sm">
                {searchQuery ? 'Try adjusting your search' : 'Add guests to your wedding first'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredGuests.map((guest) => {
                const isExcluded = excludedGuestIds.includes(guest.id);
                return (
                  <div
                    key={guest.id}
                    className={`p-3 hover:bg-muted/50 transition-colors ${
                      isExcluded ? 'opacity-50' : 'cursor-pointer'
                    }`}
                    onClick={() => !isExcluded && handleSelectGuest(guest)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{guest.name}</p>
                        <p className="text-sm text-muted-foreground">{guest.email}</p>
                      </div>
                      {isExcluded && <Badge variant="secondary">Already Added</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
