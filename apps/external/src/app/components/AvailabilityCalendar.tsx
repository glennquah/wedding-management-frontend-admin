'use client';

import { useState } from 'react';

import { AttendeeAvailability } from '@shared/api';
import { Button } from '@shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users } from 'lucide-react';

type AvailabilityCalendarProps = {
  attendees: AttendeeAvailability[];
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
};

export function AvailabilityCalendar({
  attendees,
  selectedMonth,
  onMonthChange,
}: AvailabilityCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Get calendar data for the month
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];

  // Add empty slots for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days in month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Calculate availability for a specific date
  const getDateAvailability = (date: Date) => {
    const connectedAttendees = attendees.filter((a) => a.isConnected);

    if (connectedAttendees.length === 0) {
      return { available: 0, busy: 0, total: 0, percentage: 0, color: 'bg-gray-100' };
    }

    let busyCount = 0;

    connectedAttendees.forEach((attendee) => {
      const isBusy = attendee.busySlots.some((slot) => {
        if (!slot.start || !slot.end) return false;
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        // Check if slot overlaps with this day
        return slotStart < dayEnd && slotEnd > dayStart;
      });

      if (isBusy) busyCount++;
    });

    const total = connectedAttendees.length;
    const available = total - busyCount;
    const percentage = (available / total) * 100;

    // Color coding based on availability
    let color = 'bg-gray-100';
    if (percentage === 100) {
      color = 'bg-green-100 border-green-300'; // All available
    } else if (percentage >= 75) {
      color = 'bg-green-50 border-green-200'; // Most available
    } else if (percentage >= 50) {
      color = 'bg-yellow-50 border-yellow-200'; // Some available
    } else if (percentage > 0) {
      color = 'bg-orange-50 border-orange-200'; // Few available
    } else {
      color = 'bg-red-50 border-red-200'; // None available
    }

    return { available, busy: busyCount, total, percentage, color };
  };

  // Get attendees busy on a specific date
  const getAttendeesForDate = (date: Date) => {
    const connectedAttendees = attendees.filter((a) => a.isConnected);

    const busy: string[] = [];
    const available: string[] = [];

    connectedAttendees.forEach((attendee) => {
      const isBusy = attendee.busySlots.some((slot) => {
        if (!slot.start || !slot.end) return false;
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return slotStart < dayEnd && slotEnd > dayStart;
      });

      if (isBusy) {
        busy.push(attendee.name);
      } else {
        available.push(attendee.name);
      }
    });

    return { busy, available };
  };

  // Month navigation
  const previousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Availability Calendar
            </CardTitle>
            <CardDescription>View combined availability for all key attendees</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>All Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
            <span>Partially Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>All Busy</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const availability = getDateAvailability(date);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const attendeesInfo = hoveredDate === dateStr ? getAttendeesForDate(date) : null;

            return (
              <div
                key={dateStr}
                className="relative aspect-square"
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div
                  className={`
                    w-full h-full rounded-lg border-2 p-2 flex flex-col items-center justify-center
                    transition-all cursor-pointer hover:shadow-md
                    ${availability.color}
                    ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${isPast ? 'opacity-40' : ''}
                  `}
                >
                  <div className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </div>
                  {availability.total > 0 && (
                    <div className="text-xs mt-1 text-center">
                      <span className="font-medium">{availability.available}</span>
                      <span className="text-muted-foreground">/{availability.total}</span>
                    </div>
                  )}
                </div>

                {/* Tooltip on hover */}
                {attendeesInfo && hoveredDate === dateStr && (
                  <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white border rounded-lg shadow-lg">
                    <div className="text-sm font-semibold mb-2">
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>

                    {attendeesInfo.available.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-medium text-green-700 mb-1">✓ Available:</div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {attendeesInfo.available.map((name) => (
                            <div key={name}>{name}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {attendeesInfo.busy.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-red-700 mb-1">✗ Busy:</div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {attendeesInfo.busy.map((name) => (
                            <div key={name}>{name}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {attendees.filter((a) => a.isConnected).length} of {attendees.length} attendees have
              connected calendars
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
