'use client';

import { CreateListingDto } from '@shared/api';
import { ImageUploadWidget, DatePickerWithPeriods, DateWithPeriod } from '@shared/components';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { CldImage } from 'next-cloudinary';
import * as React from 'react';
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
      const periodsFromStrings = formData.availabilities.map(availability => {
        // Handle new object format (AvailabilitySlotDto)
        if (typeof availability === 'object' && availability.startTime && availability.endTime) {
          // New object format
          const startDateTime = availability.startTime;
          const endDateTime = availability.endTime;

          // Extract date and times
          const [dateStr, startTimeStr] = startDateTime.split('T');
          const [, endTimeStr] = endDateTime.split('T');

          const startTime = startTimeStr.slice(0, 5); // Get HH:mm format
          const endTime = endTimeStr.slice(0, 5); // Get HH:mm format

          const hour = parseInt(startTime.split(':')[0]);

          let period: DateWithPeriod['period'] = 'full-day';
          if (hour >= 8 && hour < 15) {
            period = 'morning';
          } else if (hour >= 15 && hour < 22) {
            period = 'afternoon';
          }

          return {
            date: dateStr,
            period,
            timeRange: `${startTime} - ${endTime}`
          };
        }

        // Handle legacy string formats for backward compatibility
        const dateString = availability as unknown as string;

        // Parse ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ or legacy format: YYYY-MM-DD|HH:mm-HH:mm
        if (dateString.includes('T')) {
          // ISO 8601 format
          const date = new Date(dateString);
          const dateStr = date.toISOString().split('T')[0];
          const timeStr = date.toTimeString().slice(0, 5);
          const hour = date.getHours();

          let period: DateWithPeriod['period'] = 'full-day';
          if (hour >= 8 && hour < 15) {
            period = 'morning';
          } else if (hour >= 15 && hour < 22) {
            period = 'afternoon';
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
          if (hour >= 8 && hour < 15) {
            period = 'morning';
          } else if (hour >= 15 && hour < 22) {
            period = 'afternoon';
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
    // Convert to backend format: AvailabilitySlotDto objects with start and end times
    const availabilities = dates.map(d => {
      const [startTime, endTime] = d.timeRange.replace(' - ', '-').split('-');
      return {
        startTime: `${d.date}T${startTime}:00`,
        endTime: `${d.date}T${endTime}:00`,
        date: d.date
      };
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
          <Label htmlFor="imageUrls">Listing Image</Label>
          <div className="space-y-4">
            <ImageUploadWidget
              onUpload={(url) => {
                onFormDataChange({ imageUrls: [url] });
              }}
              maxImageWidth={800}
            />
            {formData.imageUrls?.[0] && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Current image:</p>
                <CldImage
                  width={200}
                  height={150}
                  src={formData.imageUrls[0]}
                  sizes="100vw"
                  alt="Listing preview"
                  className="rounded-lg shadow-sm border"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload an image for your listing. Recommended size: 800x600px minimum.
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