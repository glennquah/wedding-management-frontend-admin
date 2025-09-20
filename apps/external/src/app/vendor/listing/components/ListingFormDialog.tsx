import * as React from 'react';
import { DatePickerWithPeriods, DateWithPeriod } from '@shared/components';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { CreateListingDto } from '@shared/api';
import { Listing } from '../types';

interface ListingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingListing: Listing | null;
  formData: Partial<CreateListingDto> & { imageUrls?: string[] };
  onFormDataChange: (updates: Partial<CreateListingDto> & { imageUrls?: string[] }) => void;
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
  const [datesWithPeriods, setDatesWithPeriods] = React.useState<DateWithPeriod[]>([]);

  // Initialize dates with periods from availabilities on mount or when formData changes
  React.useEffect(() => {
    if (formData.availabilities) {
      const periodsFromStrings = formData.availabilities.map(dateString => {
        // Parse ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ or legacy format: YYYY-MM-DD|HH:mm-HH:mm
        if (dateString.includes('T')) {
          // ISO 8601 format
          const date = new Date(dateString);
          const dateStr = date.toISOString().split('T')[0];
          const timeStr = date.toTimeString().slice(0, 5);
          const hour = date.getHours();

          let period: DateWithPeriod['period'] = 'full-day';
          if (hour >= 6 && hour < 12) {
            period = 'morning';
          } else if (hour >= 12 && hour < 18) {
            period = 'afternoon';
          } else if (hour >= 18 && hour < 24) {
            period = 'evening';
          }

          return {
            date: dateStr,
            period,
            timeRange: `${timeStr} - ${timeStr}` // For display purposes
          };
        } else if (dateString.includes('|')) {
          // Legacy format: YYYY-MM-DD|HH:mm-HH:mm
          const [date, timeRange] = dateString.split('|');
          const [startTime] = timeRange.split('-');
          const hour = parseInt(startTime.split(':')[0]);

          let period: DateWithPeriod['period'] = 'full-day';
          if (hour >= 6 && hour < 12) {
            period = 'morning';
          } else if (hour >= 12 && hour < 18) {
            period = 'afternoon';
          } else if (hour >= 18 && hour < 24) {
            period = 'evening';
          }

          return {
            date,
            period,
            timeRange: timeRange.replace('-', ' - ')
          };
        } else {
          // Legacy format - treat as full day
          return {
            date: dateString,
            period: 'full-day' as const,
            timeRange: '00:00 - 23:59'
          };
        }
      });
      setDatesWithPeriods(periodsFromStrings);
    }
  }, [formData.availabilities]);

  const handleDatePeriodsChange = (dates: DateWithPeriod[]) => {
    setDatesWithPeriods(dates);
    // Convert to backend format: ISO 8601 date strings
    const availabilities = dates.map(d => {
      const [startTime, endTime] = d.timeRange.replace(' - ', '-').split('-');
      const startDateTime = `${d.date}T${startTime}:00.000Z`;
      return startDateTime;
    });
    onFormDataChange({ availabilities });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editingListing ? 'Edit Listing' : 'Add New Listing'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitButtonText={editingListing ? 'Update Listing' : 'Create Listing'}
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
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === '' ? 0 : parseFloat(value);
              onFormDataChange({ price: isNaN(numValue) ? 0 : numValue });
            }}
            placeholder="0.00"
          />
        </div>,

        <div key="imageUrls" className="md:col-span-2">
          <Label htmlFor="imageUrls">Image URL</Label>
          <Input
            id="imageUrls"
            value={formData.imageUrls?.[0] || ''}
            onChange={(e) => {
              const imageUrl = e.target.value;
              onFormDataChange({ imageUrls: imageUrl ? [imageUrl] : [] });
            }}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a URL for your listing image. If left empty, a default image will be used.
          </p>
        </div>,

        <div key="availabilities" className="md:col-span-2">
          <Label htmlFor="availabilities">Available Dates with Time Periods</Label>
          <DatePickerWithPeriods
            selectedDatesWithPeriods={datesWithPeriods}
            onChange={handleDatePeriodsChange}
            placeholder="Select available dates and time periods"
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