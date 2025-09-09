import { CreateGuestDto, GuestResponseDto } from "@shared/api";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Guest = GuestResponseDto & {
  accompanyingGuestNames?: string[];
};

interface GuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  guest: Partial<CreateGuestDto & { accompanyingGuestNames: string[] }> | Guest;
  setGuest: (guest: any) => void;
  isSubmitting: boolean;
  mode: 'add' | 'edit';
}

export default function GuestForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  guest, 
  setGuest, 
  isSubmitting, 
  mode 
}: GuestFormProps) {
  const addAccompanyingGuestField = () => {
    const currentNames = guest.accompanyingGuestNames || [];
    setGuest({
      ...guest,
      accompanyingGuestNames: [...currentNames, ""]
    });
  };

  const removeAccompanyingGuestField = (index: number) => {
    const currentNames = guest.accompanyingGuestNames || [];
    if (currentNames.length > 1) {
      const newNames = currentNames.filter((_, i) => i !== index);
      setGuest({
        ...guest,
        accompanyingGuestNames: newNames
      });
    }
  };

  const updateAccompanyingGuestName = (index: number, value: string) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const newNames = [...currentNames];
    newNames[index] = value;
    setGuest({
      ...guest,
      accompanyingGuestNames: newNames
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Guest' : 'Edit Guest'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
            <Input
              value={guest.name || ""}
              onChange={(e) => setGuest({...guest, name: e.target.value})}
              placeholder="Guest name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Group *</label>
            <Input
              value={guest.group || ""}
              onChange={(e) => setGuest({...guest, group: e.target.value})}
              placeholder="Family, Extended Family, College Friends, High School Friends, etc."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-foreground">Allergies</label>
            <Input
              value={guest.allergies || ""}
              onChange={(e) => setGuest({...guest, allergies: e.target.value})}
              placeholder="Any allergies or dietary restrictions for yourself or accompanying guests"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Confirmation Status</label>
            <select
              value={guest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING}
              onChange={(e) => setGuest({...guest, confirmationStatus: e.target.value as CreateGuestDto.confirmationStatus})}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value={CreateGuestDto.confirmationStatus.PENDING}>Pending</option>
              <option value={CreateGuestDto.confirmationStatus.CONFIRMED}>Confirmed</option>
              <option value={CreateGuestDto.confirmationStatus.REJECTED}>Rejected</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addAccompanyingGuestField}
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
                    onChange={(e) => updateAccompanyingGuestName(index, e.target.value)}
                    placeholder={`Accompanying guest ${index + 1}`}
                    className="flex-1"
                  />
                  {(guest.accompanyingGuestNames?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAccompanyingGuestField(index)}
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
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'add' ? 'Add Guest' : 'Update Guest'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}