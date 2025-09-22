'use client';

import { CreateListingDto } from '@shared/api';
import { Button, DatePickerWithPeriods, DateWithPeriod, ImageUploadWidget } from '@shared/components';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { CldImage } from 'next-cloudinary';
import * as React from 'react';

interface ListingFormProps {
  formData: Partial<CreateListingDto> & { imageUrls?: string[] };
  onFormDataChange: (updates: Partial<CreateListingDto> & { imageUrls?: string[] }) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  isEditMode: boolean;
}

export function ListingForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText,
  isEditMode
}: ListingFormProps) {
  // Convert availabilities to DateWithPeriod format using useMemo to avoid re-renders
  const datesWithPeriods = React.useMemo(() => {
    const availabilities = formData.availabilities || [];

    if (availabilities.length === 0) return [];

    return availabilities.map(availability => {
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

      if (dateString.includes('T')) {
        // Local timezone or ISO 8601 format
        const [dateStr, timeStr] = dateString.split('T');
        const hour = parseInt(timeStr.split(':')[0]);

        let period: DateWithPeriod['period'] = 'full-day';
        if (hour >= 8 && hour < 15) {
          period = 'morning';
        } else if (hour >= 15 && hour < 22) {
          period = 'afternoon';
        }

        const displayTime = timeStr.slice(0, 5); // Get HH:mm format

        return {
          date: dateStr,
          period,
          timeRange: `${displayTime} - ${displayTime}` // For display purposes
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
  }, [formData.availabilities]);

  const handleDatePeriodsChange = (dates: DateWithPeriod[]) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Name */}
        <div>
          <Label htmlFor="listingName">Service Name *</Label>
          <Input
            id="listingName"
            value={formData.listingName || ''}
            onChange={(e) => onFormDataChange({ listingName: e.target.value })}
            placeholder="e.g., Wedding Photography Package"
            required
          />
        </div>

        {/* Price */}
        <div>
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
            required
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
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
        </div>

        {/* Available Dates */}
        <div className="md:col-span-2">
          <Label htmlFor="availabilities">Available Dates with Time Periods</Label>
          <DatePickerWithPeriods
            selectedDatesWithPeriods={datesWithPeriods}
            onChange={handleDatePeriodsChange}
            placeholder="Select available dates and time periods"
            className="mt-1"
          />
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
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
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.listingName || !formData.price}
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
}