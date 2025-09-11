import { Loader2, Mail, Plus, Trash2 } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Input } from "./form/input";

interface BaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText: string;
}

interface GuestFormDialogProps extends BaseFormDialogProps {
  mode: 'guest';
  guest: {
    name: string;
    group: string;
    allergies?: string;
    confirmationStatus: string;
    accompanyingGuestNames?: string[];
    email?: string;
  };
  onGuestChange: (updates: any) => void;
  onAddAccompanyingGuest: () => void;
  onRemoveAccompanyingGuest: (index: number) => void;
  onUpdateAccompanyingGuestName: (index: number, name: string) => void;
  confirmationStatusOptions: Array<{ value: string; label: string }>;
}

interface EmailFormDialogProps extends BaseFormDialogProps {
  mode: 'email';
  guestName: string;
  email: string;
  onEmailChange: (email: string) => void;
  onSkip?: () => void;
}

type FormDialogProps = GuestFormDialogProps | EmailFormDialogProps;

export function FormDialog(props: FormDialogProps) {
  const {
    open,
    onOpenChange,
    title,
    isSubmitting,
    onSubmit,
    onCancel,
    submitButtonText,
    mode
  } = props;
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mode === 'email') {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={mode === 'email' ? "max-w-md" : "max-w-2xl max-h-[90vh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle className={mode === 'email' ? "flex items-center gap-2" : ""}>
            {mode === 'email' && <Mail className="w-5 h-5 text-brand-600" />}
            {title}
          </DialogTitle>
        </DialogHeader>

        {mode === 'guest' ? (
          <GuestForm {...(props as GuestFormDialogProps)} />
        ) : (
          <EmailForm {...(props as EmailFormDialogProps)} onKeyPress={handleKeyPress} />
        )}

        <DialogFooter className={mode === 'email' ? "gap-2" : ""}>
          {mode === 'email' && (props as EmailFormDialogProps).onSkip && (
            <Button 
              variant="secondary" 
              onClick={(props as EmailFormDialogProps).onSkip} 
              disabled={isSubmitting}
              className="flex-1"
            >
              Skip for Now
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={onCancel} 
            disabled={isSubmitting}
            className={mode === 'email' && (props as EmailFormDialogProps).onSkip ? "hidden" : ""}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || (mode === 'email' && !(props as EmailFormDialogProps).email.trim())}
            className={mode === 'email' ? "flex-1" : ""}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GuestForm({ 
  guest, 
  onGuestChange, 
  onAddAccompanyingGuest, 
  onRemoveAccompanyingGuest, 
  onUpdateAccompanyingGuestName, 
  confirmationStatusOptions 
}: Pick<GuestFormDialogProps, 'guest' | 'onGuestChange' | 'onAddAccompanyingGuest' | 'onRemoveAccompanyingGuest' | 'onUpdateAccompanyingGuestName' | 'confirmationStatusOptions'>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
        <Input
          type="email"
          value={guest.email || ""}
          onChange={(e) => onGuestChange({ email: e.target.value })}
          placeholder="Primary guest email address"
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
      <div className="md:col-span-3">
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
  );
}

function EmailForm({ 
  guestName, 
  email, 
  onEmailChange, 
  isSubmitting,
  onKeyPress 
}: Pick<EmailFormDialogProps, 'guestName' | 'email' | 'onEmailChange' | 'isSubmitting'> & { onKeyPress: (e: React.KeyboardEvent) => void }) {
  return (
    <div className="py-4">
      <p className="text-sm text-muted-foreground mb-4">
        Would you like to add an email address for <span className="font-medium text-foreground">{guestName}</span>? 
        This will help with sending invitations and updates.
      </p>
      
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Enter email address"
          className="w-full"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
