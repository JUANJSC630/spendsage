"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useIsMobile from "@/hooks/useIsMobile"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MobileResponsiveDatePicker({
  date,
  onDateChange,
  placeholder = "Selecciona una fecha",
  className,
  disabled = false,
}: DatePickerProps) {
  const isMobile = useIsMobile();

  // Para dispositivos móviles, usamos Sheet (drawer) en lugar de Popover
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>{placeholder}</span>}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[60vh]">
          <div className="flex flex-col h-full pt-6">
            <h2 className="text-lg font-semibold mb-4">Selecciona una fecha</h2>
            <div className="flex justify-center flex-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  onDateChange?.(newDate);
                  // Cerrar automáticamente el sheet después de seleccionar
                  const closeEvent = new CustomEvent('close-sheet');
                  document.dispatchEvent(closeEvent);
                }}
                initialFocus
                className="rounded-md border max-w-full"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  // En desktop, seguimos usando el Popover normal
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}