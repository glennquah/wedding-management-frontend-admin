import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText: string;
  guest: {
    name: string;
    group: string;
    allergies?: string;
    confirmationStatus: string;
    accompanyingGuestNames?: string[];
  };
  onGuestChange: (updates: any) => void;
  onAddAccompanyingGuest: () => void;
  onRemoveAccompanyingGuest: (index: number) => void;
  onUpdateAccompanyingGuestName: (index: number, name: string) => void;
  confirmationStatusOptions: Array<{ value: string; label: string }>;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  isSubmitting,
  onSubmit,
  onCancel,
  submitButtonText,
  guest,
  onGuestChange,
  onAddAccompanyingGuest,
  onRemoveAccompanyingGuest,
  onUpdateAccompanyingGuestName,
  confirmationStatusOptions
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
            <Input
              value={guest.name}
              onChange={(e) => onGuestChange({ name: e.target.value })}
              placeholder="Guest name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Group *</label>
            <Input
              value={guest.group}
              onChange={(e) => onGuestChange({ group: e.target.value })}
              placeholder="Family, Extended Family, College Friends, High School Friends, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-foreground">Allergies</label>
            <Input
              value={guest.allergies || ""}
              onChange={(e) => onGuestChange({ allergies: e.target.value })}
              placeholder="Any allergies or dietary restrictions for yourself or accompanying guests"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Confirmation Status</label>
            <select
              value={guest.confirmationStatus}
              onChange={(e) => onGuestChange({ confirmationStatus: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              {confirmationStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddAccompanyingGuest}
                className="text-brand-600 hover:text-brand-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Guest
              </Button>
            </div>
            <div className="space-y-2">
              {(guest.accompanyingGuestNames || [""]).map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={name}
                    onChange={(e) => onUpdateAccompanyingGuestName(index, e.target.value)}
                    placeholder={`Accompanying guest ${index + 1}`}
                    className="flex-1"
                  />
                  {(guest.accompanyingGuestNames?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAccompanyingGuest(index)}
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
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