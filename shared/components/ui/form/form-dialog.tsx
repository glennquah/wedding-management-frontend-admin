import { ReactNode } from 'react';

import { Button } from '../button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../dialog';
import { cn } from '../../lib/utils';
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
  disabled?: boolean;
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
  disabled = false,
}: FormDialogProps) {
  const getGridClasses = () => {
    switch (noOfColumns) {
      case 1:
        return 'grid grid-cols-1 gap-4';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-3 gap-4';
      case 4:
        return 'grid grid-cols-1 md:grid-cols-4 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={cn(getGridClasses(), '[&>*]:w-full')}>{formFields}</div>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || disabled}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
