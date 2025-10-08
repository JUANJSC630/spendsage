"use client";

import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@/utils/CalendarIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// For Single Date Picker
export interface MobileDatePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const MobileDatePicker = ({
  date,
  onDateChange,
  disabled,
  className,
  placeholder = "Pick a date",
}: MobileDatePickerProps) => {
  // Custom input component
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        ref={ref}
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground",
          className
        )}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value || placeholder}
      </Button>
    )
  );
  
  CustomInput.displayName = "CustomDateInput";

  return (
    <DatePicker
      selected={date}
      onChange={onDateChange}
      customInput={<CustomInput />}
      dateFormat="dd/MM/yyyy"
      disabled={disabled}
      withPortal={false} // Disable portal for better mobile interaction
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      fixedHeight
      calendarClassName="shadow-lg border rounded-lg"
      wrapperClassName="w-full"
    />
  );
};

// For Date Range Picker
export interface MobileDateRangePickerProps {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const MobileDateRangePicker = ({
  dateRange,
  onDateRangeChange,
  disabled,
  className,
  placeholder = "Select date range",
}: MobileDateRangePickerProps) => {
  const { from, to } = dateRange;
  const [startDate, setStartDate] = useState<Date | null>(from);
  const [endDate, setEndDate] = useState<Date | null>(to);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange({ from: start, to: end });
  };

  // Display formatted date range or placeholder
  const displayValue = startDate && endDate
    ? `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
    : startDate
    ? format(startDate, "dd/MM/yyyy")
    : placeholder;

  // Custom input component for range picker
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ onClick }, ref) => (
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        ref={ref}
        className={cn(
          "w-full justify-start text-left font-normal",
          !startDate && !endDate && "text-muted-foreground",
          className
        )}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {displayValue}
      </Button>
    )
  );

  CustomInput.displayName = "CustomDateRangeInput";

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      customInput={<CustomInput />}
      dateFormat="dd/MM/yyyy"
      disabled={disabled}
      withPortal={false} // Disable portal for better mobile interaction
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      monthsShown={1}
      fixedHeight
      calendarClassName="shadow-lg border rounded-lg"
      wrapperClassName="w-full"
    />
  );
};