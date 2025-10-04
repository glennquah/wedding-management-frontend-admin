import { ReactNode, useState } from 'react';

import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Input } from './form/input';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName: string;
  description?: string | ReactNode;
  onConfirm: (password?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  requirePasswordConfirmation?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title = 'Confirm Deletion',
  itemName,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
  requirePasswordConfirmation = false,
}: DeleteConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const defaultDescription = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
  const passwordDescription = `Are you sure you want to delete ${itemName}? This action cannot be undone. Please enter your password to confirm.`;

  const handleConfirm = () => {
    if (requirePasswordConfirmation) {
      if (!password.trim()) {
        setPasswordError('Password is required');
        return;
      }
      onConfirm(password);
    } else {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setPassword('');
    setPasswordError('');
    onCancel();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ||
              (requirePasswordConfirmation ? passwordDescription : defaultDescription)}
          </DialogDescription>
        </DialogHeader>

        {requirePasswordConfirmation && (
          <div className="space-y-2 px-6">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter your password"
              className={passwordError ? 'border-red-500' : ''}
            />
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelButtonText}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
