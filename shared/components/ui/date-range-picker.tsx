'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date => new Date(`${dateString}T00:00:00`);

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBefore = (a: Date, b: Date): boolean => a.getTime() < b.getTime();

const isAfter = (a: Date, b: Date): boolean => a.getTime() > b.getTime();

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value.startDate) {
      return parseDate(value.startDate);
    }
    if (value.endDate) {
      return parseDate(value.endDate);
    }
    return new Date();
  });
  const [pendingRange, setPendingRange] = useState<DateRange>(value);
  const [hoverDate, setHoverDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPendingRange(value);
    if (value.startDate) {
      setCurrentMonth(parseDate(value.startDate));
    }
  }, [value.startDate, value.endDate]);

  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  }, [currentMonth]);

  const firstDayOffset = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  }, [currentMonth]);

  const startDateObj = pendingRange.startDate ? parseDate(pendingRange.startDate) : undefined;
  const endDateObj = pendingRange.endDate ? parseDate(pendingRange.endDate) : undefined;
  const hoverDateObj = hoverDate ? parseDate(hoverDate) : undefined;

  const isWithinRange = (date: Date): boolean => {
    if (startDateObj && endDateObj) {
      return !isBefore(date, startDateObj) && !isAfter(date, endDateObj);
    }

    if (startDateObj && hoverDateObj) {
      if (isBefore(hoverDateObj, startDateObj)) {
        return !isBefore(date, hoverDateObj) && !isAfter(date, startDateObj);
      }
      return !isBefore(date, startDateObj) && !isAfter(date, hoverDateObj);
    }

    return false;
  };

  const handleDateSelection = (date: Date) => {
    const dateString = formatDate(date);

    if (!startDateObj || (startDateObj && endDateObj)) {
      const nextRange: DateRange = { startDate: dateString, endDate: undefined };
      setPendingRange(nextRange);
      onChange(nextRange);
      setHoverDate(undefined);
      return;
    }

    if (isSameDay(date, startDateObj)) {
      const nextRange: DateRange = { startDate: dateString, endDate: undefined };
      setPendingRange(nextRange);
      onChange(nextRange);
      setHoverDate(undefined);
      return;
    }

    const [start, end] = isBefore(date, startDateObj)
      ? [dateString, formatDate(startDateObj)]
      : [formatDate(startDateObj), dateString];

    const nextRange: DateRange = { startDate: start, endDate: end };
    setPendingRange(nextRange);
    setHoverDate(undefined);
    onChange(nextRange);
    setOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return next;
    });
  };

  const clearRange = () => {
    const empty: DateRange = { startDate: undefined, endDate: undefined };
    setPendingRange(empty);
    setHoverDate(undefined);
    onChange(empty);
  };

  const getDisplayText = () => {
    if (value.startDate && value.endDate) {
      const start = parseDate(value.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const end = parseDate(value.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return `${start} – ${end}`;
    }

    if (value.startDate) {
      return parseDate(value.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    return placeholder;
  };

  const renderCalendarDays = () => {
    const cells: React.ReactElement[] = [];

    for (let i = 0; i < firstDayOffset; i += 1) {
      cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      const isSelectedStart = startDateObj && isSameDay(date, startDateObj);
      const isSelectedEnd = endDateObj && isSameDay(date, endDateObj);
      const inRange = isWithinRange(date);
      const isPast = isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)));

      cells.push(
        <button
          key={dateString}
          type="button"
          onClick={() => handleDateSelection(date)}
          onMouseEnter={() => setHoverDate(dateString)}
          onMouseLeave={() => setHoverDate(undefined)}
          disabled={isPast}
          className={cn(
            'w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isSelectedStart && 'bg-primary text-primary-foreground',
            isSelectedEnd && 'bg-primary text-primary-foreground',
            inRange && !isSelectedStart && !isSelectedEnd && 'bg-primary/10 text-primary',
            isPast && 'text-muted-foreground opacity-50 cursor-not-allowed',
          )}
        >
          {day}
        </button>,
      );
    }

    return cells;
  };

  const showClear = Boolean(value.startDate || value.endDate);

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-foreground"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayText()}
            {showClear && (
              <span className="ml-auto text-xs text-muted-foreground">Click to change</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Previous month</span>←
              </Button>
              <div className="text-sm font-medium">
                {currentMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Next month</span>→
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="w-8 h-8 text-xs font-medium text-muted-foreground flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">{renderCalendarDays()}</div>

            <div className="flex justify-between items-center pt-2 border-t">
              {showClear ? (
                <button
                  type="button"
                  onClick={clearRange}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear selection
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">Select start then end date</span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
