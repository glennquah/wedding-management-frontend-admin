"use client"

import { Calendar as CalendarIcon, X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/utils"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DatePickerProps {
  selectedDates: string[]
  onChange: (dates: string[]) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  selectedDates = [],
  onChange,
  placeholder = "Select dates",
  className
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const parseDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00')
  }

  const isDateSelected = (date: Date): boolean => {
    const dateString = formatDate(date)
    return selectedDates.includes(dateString)
  }

  const toggleDate = (date: Date) => {
    const dateString = formatDate(date)
    if (isDateSelected(date)) {
      onChange(selectedDates.filter(d => d !== dateString))
    } else {
      onChange([...selectedDates, dateString])
    }
  }

  const removeDate = (dateToRemove: string) => {
    onChange(selectedDates.filter(d => d !== dateToRemove))
  }

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const days: React.ReactElement[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isSelected = isDateSelected(date)
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isPast && toggleDate(date)}
          disabled={isPast}
          className={cn(
            "w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
            isPast && "text-muted-foreground opacity-50 cursor-not-allowed"
          )}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDates.length && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDates.length > 0
              ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Previous month</span>
                ←
              </Button>
              <div className="text-sm font-medium">{monthYear}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Next month</span>
                →
              </Button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div
                  key={index}
                  className="w-8 h-8 text-xs font-medium text-muted-foreground flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected dates display */}
      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedDates.sort().map(date => (
            <div
              key={date}
              className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
            >
              <span>{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <button
                type="button"
                onClick={() => removeDate(date)}
                className="hover:text-primary/70 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}