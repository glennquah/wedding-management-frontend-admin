'use client';

import { CreateMicrositeDto, ScheduleItemDto } from '@shared/api';
import FormField from '@shared/components/FormField';
import FormFieldTextArea from '@shared/components/FormFieldTextArea';
import { Button } from '@shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface WeddingScheduleProps {
  formData: CreateMicrositeDto;
  handleScheduleFieldChange: (index: number, field: keyof ScheduleItemDto, value: string) => void;
  addScheduleItem: () => void;
  removeScheduleItem: (index: number) => void;
}

export function WeddingSchedule({
  formData,
  handleScheduleFieldChange,
  addScheduleItem,
  removeScheduleItem,
}: WeddingScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wedding Schedule</CardTitle>
        <CardDescription>Add timeline items for the wedding day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {(formData.schedule ?? []).map((item, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg p-6 bg-white">
            {/* Delete button */}
            {(formData.schedule?.length ?? 0) > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeScheduleItem(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Input */}
              <div className="mt-[-16px] justify-between">
                <FormField
                  label="Time"
                  id={`schedule-time-${index}`}
                  value={item.time}
                  type="time"
                  required={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleScheduleFieldChange(index, 'time', e.target.value)
                  }
                />
              </div>

              {/* Title Input */}
              <div className="mt-[-16px]">
                <FormField
                  label="Title"
                  id={`schedule-title-${index}`}
                  value={item.title}
                  type="text"
                  placeholder="e.g., Guest Arrival & Registration"
                  required={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleScheduleFieldChange(index, 'title', e.target.value)
                  }
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-2 md:col-span-3">
                <FormFieldTextArea
                  placeholder="e.g., Doors open and light refreshments served."
                  label="Description"
                  id={`schedule-description-${index}`}
                  value={item.description}
                  onChange={(e) => handleScheduleFieldChange(index, 'description', e.target.value)}
                  required={true}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="darkOutline"
          onClick={addScheduleItem}
          className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule Item
        </Button>
      </CardContent>
    </Card>
  );
}
