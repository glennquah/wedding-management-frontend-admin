"use client"

import { Calendar as CalendarIcon, Clock, X, Edit2 } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/utils"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export type TimePeriod = 'full-day' | 'morning' | 'afternoon'

export interface DateWithPeriod {
  date: string
  period: TimePeriod
  timeRange: string
}

interface DatePickerProps {
  selectedDates: string[]
  onChange: (dates: string[]) => void
  placeholder?: string
  className?: string
  enableTimePeriods?: boolean
  selectedDatesWithPeriods?: DateWithPeriod[]
  onChangeWithPeriods?: (dates: DateWithPeriod[]) => void
}

export function DatePicker({
  selectedDates = [],
  onChange,
  placeholder = "Select dates",
  className,
  enableTimePeriods = false,
  selectedDatesWithPeriods = [],
  onChangeWithPeriods
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [dragStart, setDragStart] = React.useState<string | null>(null)
  const [dragEnd, setDragEnd] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [tempSelectedDates, setTempSelectedDates] = React.useState<string[]>([])
  const [selectedPeriodForRange, setSelectedPeriodForRange] = React.useState<TimePeriod | null>(null)
  const [showPeriodSelection, setShowPeriodSelection] = React.useState(false)
  const [editingDateRange, setEditingDateRange] = React.useState<string[] | null>(null)

  const timePeriods: { period: TimePeriod; label: string; timeRange: string }[] = [
    { period: 'full-day', label: 'Full Day', timeRange: '00:00 - 23:59' },
    { period: 'morning', label: 'Morning', timeRange: '08:00 - 15:00' },
    { period: 'afternoon', label: 'Afternoon', timeRange: '15:00 - 22:00' }
  ]

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const parseDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00')
  }

  const isDateSelected = (date: Date): boolean => {
    const dateString = formatDate(date)
    if (enableTimePeriods) {
      return selectedDatesWithPeriods.some(d => d.date === dateString)
    }
    return selectedDates.includes(dateString)
  }

  const isDateInTempSelection = (date: Date): boolean => {
    const dateString = formatDate(date)
    return tempSelectedDates.includes(dateString)
  }

  const getDatesBetween = (start: string, end: string): string[] => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const dates: string[] = []

    // Ensure start is before end
    const actualStart = startDate <= endDate ? startDate : endDate
    const actualEnd = startDate <= endDate ? endDate : startDate

    const current = new Date(actualStart)
    while (current <= actualEnd) {
      dates.push(formatDate(current))
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  const handleMouseDown = (date: Date) => {
    const dateString = formatDate(date)
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
    if (isPast) return

    setDragStart(dateString)
    setDragEnd(dateString)
    setIsDragging(true)
    setTempSelectedDates([dateString])
  }

  const handleMouseEnter = (date: Date) => {
    if (!isDragging || !dragStart) return

    const dateString = formatDate(date)
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
    if (isPast) return

    setDragEnd(dateString)
    const datesBetween = getDatesBetween(dragStart, dateString)
    setTempSelectedDates(datesBetween)
  }

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd && tempSelectedDates.length > 0) {
      if (enableTimePeriods) {
        setShowPeriodSelection(true)
      } else {
        // For non-period mode, just add the dates
        const newDates = [...new Set([...selectedDates, ...tempSelectedDates])]
        onChange(newDates)
        resetDragState()
      }
    } else {
      resetDragState()
    }
  }

  const resetDragState = () => {
    setDragStart(null)
    setDragEnd(null)
    setIsDragging(false)
    setTempSelectedDates([])
  }

  const confirmPeriodSelection = (period: TimePeriod) => {
    if (tempSelectedDates.length > 0) {
      const periodInfo = timePeriods.find(p => p.period === period)!
      const newDatesWithPeriods = tempSelectedDates.map(date => ({
        date,
        period,
        timeRange: periodInfo.timeRange
      }))

      // Remove any existing dates and add new ones
      const filteredExisting = selectedDatesWithPeriods.filter(d =>
        !tempSelectedDates.includes(d.date)
      )

      onChangeWithPeriods?.([...filteredExisting, ...newDatesWithPeriods])
    }

    setShowPeriodSelection(false)
    setSelectedPeriodForRange(null)
    resetDragState()
  }

  const cancelPeriodSelection = () => {
    setShowPeriodSelection(false)
    setSelectedPeriodForRange(null)
    resetDragState()
  }

  const removeDate = (dateToRemove: string) => {
    if (enableTimePeriods) {
      const updatedDates = selectedDatesWithPeriods.filter(d => d.date !== dateToRemove)
      onChangeWithPeriods?.(updatedDates)
    } else {
      onChange(selectedDates.filter(d => d !== dateToRemove))
    }
  }

  const editDateRange = (dates: string[]) => {
    setEditingDateRange(dates)
    setShowPeriodSelection(true)
  }

  const confirmEditPeriod = (period: TimePeriod) => {
    if (editingDateRange) {
      const periodInfo = timePeriods.find(p => p.period === period)!
      const newDatesWithPeriods = editingDateRange.map(date => ({
        date,
        period,
        timeRange: periodInfo.timeRange
      }))

      // Remove existing dates and add updated ones
      const filteredExisting = selectedDatesWithPeriods.filter(d =>
        !editingDateRange.includes(d.date)
      )

      onChangeWithPeriods?.([...filteredExisting, ...newDatesWithPeriods])
    }

    setEditingDateRange(null)
    setShowPeriodSelection(false)
  }

  const cancelEdit = () => {
    setEditingDateRange(null)
    setShowPeriodSelection(false)
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
      const isInTempSelection = isDateInTempSelection(date)
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

      days.push(
        <button
          key={day}
          type="button"
          onMouseDown={() => handleMouseDown(date)}
          onMouseEnter={() => handleMouseEnter(date)}
          onMouseUp={handleMouseUp}
          disabled={isPast}
          className={cn(
            "w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors select-none",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
            isInTempSelection && !isSelected && "bg-primary/50 text-primary-foreground",
            isPast && "text-muted-foreground opacity-50 cursor-not-allowed"
          )}
        >
          {day}
        </button>
      )
    }

    return days
  }

  // Add global mouse up event listener
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp()
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging])

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const getDisplayText = () => {
    return placeholder
  }

  // Group consecutive dates with same period for display
  const groupConsecutiveDates = (dates: DateWithPeriod[]) => {
    const sorted = [...dates].sort((a, b) => a.date.localeCompare(b.date))
    const groups: { dates: string[], period: TimePeriod, timeRange: string }[] = []

    for (const dateWithPeriod of sorted) {
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && lastGroup.period === dateWithPeriod.period) {
        // Check if this date is consecutive to the last date in the group
        const lastDate = new Date(lastGroup.dates[lastGroup.dates.length - 1])
        const currentDate = new Date(dateWithPeriod.date)
        const dayDiff = (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)

        if (dayDiff === 1) {
          lastGroup.dates.push(dateWithPeriod.date)
          continue
        }
      }

      groups.push({
        dates: [dateWithPeriod.date],
        period: dateWithPeriod.period,
        timeRange: dateWithPeriod.timeRange
      })
    }

    return groups
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-foreground"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 max-h-96 overflow-y-auto" align="start" side="bottom">
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

            {/* Instructions */}
            <div className="text-xs text-muted-foreground mb-3 text-center">
              {enableTimePeriods ? "Drag to select multiple dates, then choose time period" : "Drag to select multiple dates"}
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
            <div className="grid grid-cols-7 gap-1 select-none">
              {renderCalendar()}
            </div>

            {/* Period Selection */}
            {enableTimePeriods && showPeriodSelection && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Select time period for {editingDateRange ? 'selected dates' : `${tempSelectedDates.length} date${tempSelectedDates.length === 1 ? '' : 's'}`}
                </div>
                <div className="space-y-1">
                  {timePeriods.map((period) => (
                    <button
                      key={period.period}
                      type="button"
                      onClick={() => editingDateRange ? confirmEditPeriod(period.period) : confirmPeriodSelection(period.period)}
                      className="w-full text-left px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="font-medium">{period.label}</div>
                      <div className="text-xs text-muted-foreground">{period.timeRange}</div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={editingDateRange ? cancelEdit : cancelPeriodSelection}
                  className="w-full mt-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected dates display */}
      {enableTimePeriods ? (
        selectedDatesWithPeriods.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {groupConsecutiveDates(selectedDatesWithPeriods).map((group, index) => {
              const isRange = group.dates.length > 1
              const displayText = isRange
                ? `${new Date(group.dates[0] + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(group.dates[group.dates.length - 1] + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : new Date(group.dates[0] + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

              return (
                <div
                  key={`${group.dates[0]}-${group.period}-${index}`}
                  className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                >
                  <div className="flex flex-col">
                    <span>{displayText}</span>
                    <span className="text-[10px] text-primary/70">{group.timeRange}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedDates = selectedDatesWithPeriods.filter(d =>
                        !group.dates.includes(d.date) || d.period !== group.period
                      )
                      onChangeWithPeriods?.(updatedDates)
                    }}
                    className="hover:text-primary/70 transition-colors"
                    title="Remove dates"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )
      ) : (
        selectedDates.length > 0 && (
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
        )
      )}
    </div>
  )
}