"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MobileDateRangePicker } from "@/components/ui/react-datepicker";
import useIsMobile from "@/hooks/useIsMobile";
import { DateRange } from "react-day-picker";

// Props para compatibilidad con los dos formatos diferentes
interface AdaptiveDateRangePickerProps {
  // Formato nuevo (Mobile)
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange?: (range: { from: Date | null; to: Date | null }) => void;

  // Formato original (Shadcn DateRangePicker)
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;

  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AdaptiveDateRangePicker(props: AdaptiveDateRangePickerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Para móvil, usar formato de dateRange
    const mobileProps = {
      dateRange: props.dateRange || { from: props.date?.from || null, to: props.date?.to || null },
      onDateRangeChange: props.onDateRangeChange || ((range: { from: Date | null; to: Date | null }) => {
        props.onDateChange?.({
          from: range.from || undefined,
          to: range.to || undefined
        });
      }),
      placeholder: props.placeholder,
      className: props.className,
      disabled: props.disabled
    };
    return <MobileDateRangePicker {...mobileProps} />;
  }

  // Para desktop, usar formato original de Shadcn
  const desktopProps = {
    date: props.date || { from: props.dateRange?.from || undefined, to: props.dateRange?.to || undefined },
    onDateChange: props.onDateChange || ((date: DateRange | undefined) => {
      props.onDateRangeChange?.({
        from: date?.from || null,
        to: date?.to || null
      });
    }),
    placeholder: props.placeholder,
    className: props.className,
    disabled: props.disabled
  };

  return <DateRangePicker {...desktopProps} />;
}