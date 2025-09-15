import { DatePicker } from "@shared/components";
import { FormDialog } from "@shared/components/ui/form/form-dialog";
import { Input } from "@shared/components/ui/form/input";
import { Label } from "@shared/components/ui/form/label";
import { CreateListingDto } from "@shared/api";
import { Listing } from "../hooks/useListingData";

interface ListingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingListing: Listing | null;
  formData: Partial<CreateListingDto>;
  onFormDataChange: (updates: Partial<CreateListingDto>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ListingFormDialog({
  open,
  onOpenChange,
  editingListing,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting
}: ListingFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editingListing ? "Edit Listing" : "Add New Listing"}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitButtonText={editingListing ? "Update Listing" : "Create Listing"}
      formFields={[
        <div key="listingName">
          <Label htmlFor="listingName">Service Name *</Label>
          <Input
            id="listingName"
            value={formData.listingName || ''}
            onChange={(e) => onFormDataChange({ listingName: e.target.value })}
            placeholder="e.g., Wedding Photography Package"
          />
        </div>,

        <div key="price">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) => onFormDataChange({ price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>,

        <div key="availabilities" className="md:col-span-2">
          <Label htmlFor="availabilities">Available Dates</Label>
          <DatePicker
            selectedDates={formData.availabilities || []}
            onChange={(dates) => onFormDataChange({ availabilities: dates })}
            placeholder="Select available dates"
            className="mt-1"
          />
        </div>,

        <div key="remarks" className="md:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <textarea
            id="remarks"
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            value={formData.remarks || ''}
            onChange={(e) => onFormDataChange({ remarks: e.target.value })}
            placeholder="Additional details about this service..."
          />
        </div>
      ]}
      noOfColumns={2}
    />
  );
}