import { DateRangePicker, ItemRankingList } from '@shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Calendar } from 'lucide-react';

interface DatePreferencesCardProps {
  earliestDate: string;
  latestDate: string;
  preferredDays: string[];
  onEarliestDateChange: (date: string) => void;
  onLatestDateChange: (date: string) => void;
  onPreferredDaysChange: (days: string[]) => void;
}

export function DatePreferencesCard({
  earliestDate,
  latestDate,
  preferredDays,
  onEarliestDateChange,
  onLatestDateChange,
  onPreferredDaysChange,
}: DatePreferencesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date Preferences
        </CardTitle>
        <CardDescription>Set your preferred date range and constraints</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Wedding Date Range</label>
          <DateRangePicker
            value={{
              startDate: earliestDate || undefined,
              endDate: latestDate || undefined,
            }}
            onChange={(range) => {
              onEarliestDateChange(range.startDate || '');
              onLatestDateChange(range.endDate || '');
            }}
            placeholder="Select date range"
            className="w-full"
          />
        </div>
        <div>
          <ItemRankingList
            selectedItems={preferredDays}
            availableItems={[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ]}
            onItemsChange={onPreferredDaysChange}
            label="Preferred Days"
            description="Drag to reorder. Days at the top will be prioritized when analyzing dates."
            emptyMessage="No days selected. Add at least one preferred day below."
            addMoreLabel="Add More Days"
          />
        </div>
      </CardContent>
    </Card>
  );
}
