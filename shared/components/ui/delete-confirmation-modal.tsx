import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName: string;
  description?: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title = "Confirm Deletion",
  itemName,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel"
}: DeleteConfirmationModalProps) {
  const defaultDescription = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelButtonText}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}