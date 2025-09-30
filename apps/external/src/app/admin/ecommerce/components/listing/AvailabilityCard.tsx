import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { AvailabilityCardProps } from '../../types';

export function AvailabilityCard({
  availabilities,
  currentPage,
  onPreviousPage,
  onNextPage,
  itemsPerPage,
  selectedSlots = [],
  onSlotToggle
}: AvailabilityCardProps) {
  if (availabilities.length === 0) return null;

  const totalPages = Math.ceil(availabilities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAvailabilities = availabilities.slice(startIndex, endIndex);

  const isSlotSelected = (slot: typeof availabilities[0]) => {
    return selectedSlots.some(s =>
      s.startTime === slot.startTime &&
      s.endTime === slot.endTime &&
      s.date === slot.date
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Availability
        </CardTitle>
        <CardDescription>
          {onSlotToggle
            ? `Select time slots for this listing (${selectedSlots.length} selected)`
            : `Available time slots for this listing (${availabilities.length} total)`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {currentAvailabilities.map((slot, index) => {
            const selected = isSlotSelected(slot);
            return (
              <div
                key={startIndex + index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selected
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onSlotToggle?.(slot)}
              >
                <div className="text-sm text-muted-foreground">
                  {slot.date && new Date(slot.date).toLocaleDateString('en-SG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="font-medium">
                  {new Date(slot.startTime).toLocaleTimeString('en-SG', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(slot.endTime).toLocaleTimeString('en-SG', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {selected && (
                  <div className="text-xs text-blue-600 font-medium mt-1">✓ Selected</div>
                )}
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, availabilities.length)} of {availabilities.length} slots
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1 px-3">
                <span className="text-sm font-medium text-gray-700">
                  {currentPage} of {totalPages}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}