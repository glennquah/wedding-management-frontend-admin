import { ReactNode } from 'react';

import { Button } from '../button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../dialog';
import { Loader2 } from 'lucide-react';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText: string;
  formFields: ReactNode[];
  noOfColumns?: number;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  isSubmitting,
  onSubmit,
  onCancel,
  submitButtonText,
  formFields,
  noOfColumns = 1,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={`grid grid-cols-1 md:grid-cols-${noOfColumns} gap-4`}>{formFields}</div>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
