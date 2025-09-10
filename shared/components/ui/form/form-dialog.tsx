import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '../button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../dialog';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText: string;
  formFields: ReactNode[];
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  isSubmitting,
  onSubmit,
  onCancel,
  submitButtonText,
  formFields: FormFields,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FormFields.map((field, index) => (
            <div key={index} className="md:col-span-1">
              {field}
            </div>
          ))}
        </div>
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