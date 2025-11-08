import { ReactNode, useEffect, useState } from 'react';

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
import { Textarea } from './textarea';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName: string;
  description?: string | ReactNode;
  onConfirm: (data: { password?: string; reason?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  requirePasswordConfirmation?: boolean;
  requireReason?: boolean;
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
  requireReason = false,
}: DeleteConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setPassword('');
        setPasswordError('');
        setReason('');
        setReasonError('');
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const defaultDescription = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
  const passwordDescription = `Are you sure you want to delete ${itemName}? This action cannot be undone. Please enter your password to confirm.`;

  const handleConfirm = () => {
    let passwordOk = true;
    let reasonOk = true;

    if (requirePasswordConfirmation) {
      if (!password.trim()) {
        setPasswordError('Password is required');
        passwordOk = false;
      }
    }

    if (requireReason) {
      if (!reason.trim()) {
        setReasonError('Reason is required');
        reasonOk = false;
      }
    }

    if (!passwordOk || !reasonOk) {
      return;
    }

    onConfirm({ password, reason });
  };

  const handleCancel = () => {
    onCancel();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (reasonError) {
      setReasonError('');
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

        {(requireReason || requirePasswordConfirmation) && (
          <div className="grid py-2">
            {requireReason && (
              <div className="space-y-2">
                <label htmlFor="deleteReason" className="text-sm font-medium">
                  Reason for Deletion
                </label>
                <Textarea
                  id="deleteReason"
                  value={reason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  placeholder="Enter the reason for deleting..."
                  className={reasonError ? 'border-red-500' : ''}
                />
                {reasonError && <p className="text-sm text-red-500">{reasonError}</p>}
              </div>
            )}

            {requirePasswordConfirmation && (
              <div className="space-y-2">
                <label htmlFor="deletePassword" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  className={passwordError ? 'border-red-500' : ''}
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {confirmButtonText}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isLoading}>
            {cancelButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
