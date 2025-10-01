'use client';

import { useState } from 'react';

import { AdminResponseDto } from '@shared/api';
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

interface CollaboratorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: AdminResponseDto[];
  onSelectCollaborator: (collaborator: AdminResponseDto) => void;
  excludedCollaboratorIds?: number[];
}

export function CollaboratorSearchModal({
  isOpen,
  onClose,
  collaborators,
  onSelectCollaborator,
  excludedCollaboratorIds = [],
}: CollaboratorSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter collaborators based on search query
  const filteredCollaborators = collaborators.filter(
    (collaborator) =>
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleSelectCollaborator = (collaborator: AdminResponseDto) => {
    onSelectCollaborator(collaborator);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Key Attendee</DialogTitle>
          <DialogDescription>
            Select collaborators from your wedding planning team whose availability is critical
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
          {filteredCollaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No collaborators found</p>
              <p className="text-sm">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add collaborators to your wedding first'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredCollaborators.map((collaborator) => {
                const isExcluded = excludedCollaboratorIds.includes(collaborator.id);
                return (
                  <div
                    key={collaborator.id}
                    className={`p-3 hover:bg-muted/50 transition-colors ${
                      isExcluded ? 'opacity-50' : 'cursor-pointer'
                    }`}
                    onClick={() => !isExcluded && handleSelectCollaborator(collaborator)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{collaborator.name}</p>
                        <p className="text-sm text-muted-foreground">{collaborator.email}</p>
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
