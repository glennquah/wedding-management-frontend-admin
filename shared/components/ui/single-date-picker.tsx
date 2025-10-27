'use client';

import React, { useState } from 'react';

import { cn } from '../lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface SingleDatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
  minDate?: string; // ISO date string for minimum selectable date
  disabled?: boolean;
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

const isBefore = (a: Date, b: Date): boolean => {
  const aDate = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDate = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aDate.getTime() < bDate.getTime();
};

export function SingleDatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  minDate,
  disabled = false,
}: SingleDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return parseDate(value);
    }
    return new Date();
  });

  const selectedDate = value ? parseDate(value) : undefined;
  const minimumDate = minDate ? parseDate(minDate) : undefined;

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOffset = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateSelection = (date: Date) => {
    const dateString = formatDate(date);
    onChange(dateString);
    setOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return next;
    });
  };

  const clearDate = () => {
    onChange(undefined);
  };

  const getDisplayText = () => {
    if (value) {
      return parseDate(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return placeholder;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minimumDate && isBefore(date, minimumDate)) {
      return true;
    }
    return false;
  };

  const renderCalendarDays = () => {
    const cells: React.ReactElement[] = [];

    // Empty cells before first day of month
    for (let i = 0; i < firstDayOffset; i += 1) {
      cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isDisabled = isDateDisabled(date);

      cells.push(
        <button
          key={dateString}
          type="button"
          onClick={() => handleDateSelection(date)}
          disabled={isDisabled}
          className={cn(
            'w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
            isDisabled && 'text-muted-foreground opacity-50 cursor-not-allowed'
          )}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex h-9 w-full items-center justify-start rounded-md border border-gray-300 bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none',
              'hover:bg-accent/50',
              'focus-visible:border-0 focus-visible:ring-ring/50 focus-visible:ring-[2px]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !value && 'text-muted-foreground',
              'md:text-sm'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">{getDisplayText()}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <div className="p-3">
            {/* Calendar Header */}
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

            {/* Week days */}
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

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1 mb-2">{renderCalendarDays()}</div>

            {/* Clear button */}
            {value && (
              <div className="flex justify-between items-center pt-2 border-t">
                <button
                  type="button"
                  onClick={clearDate}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
