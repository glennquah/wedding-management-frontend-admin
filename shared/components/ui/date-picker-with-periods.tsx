"use client"

import * as React from "react"
import { DatePicker, DateWithPeriod } from "./date-picker"

interface DatePickerWithPeriodsProps {
  selectedDatesWithPeriods: DateWithPeriod[]
  onChange: (dates: DateWithPeriod[]) => void
  placeholder?: string
  className?: string
}

export function DatePickerWithPeriods({
  selectedDatesWithPeriods,
  onChange,
  placeholder = "Select dates with time periods",
  className
}: DatePickerWithPeriodsProps) {
  return (
    <DatePicker
      enableTimePeriods={true}
      selectedDatesWithPeriods={selectedDatesWithPeriods}
      onChangeWithPeriods={onChange}
      selectedDates={[]} // Not used in time period mode
      onChange={() => {}} // Not used in time period mode
      placeholder={placeholder}
      className={className}
    />
  )
}