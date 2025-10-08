"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateRangePicker({
  date,
  onDateChange,
  placeholder = "Selecciona un rango de fechas",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDateSafe = (date: Date) => {
    // Use simple format to avoid locale issues during hydration
    return format(date, "dd/MM/yyyy");
  };

  const displayText = React.useMemo(() => {
    if (!date?.from) return placeholder;

    if (date.to) {
      return `${formatDateSafe(date.from)} - ${formatDateSafe(date.to)}`;
    }

    return formatDateSafe(date.from);
  }, [date, placeholder]);

  return (
    <div className={cn("grid gap-2", className)} suppressHydrationWarning>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date?.from && "text-muted-foreground"
            )}
            disabled={disabled}
            suppressHydrationWarning
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span suppressHydrationWarning>
              {isClient ? displayText : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}