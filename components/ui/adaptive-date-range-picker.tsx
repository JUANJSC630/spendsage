"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MobileDateRangePicker } from "@/components/ui/react-datepicker";
import useIsMobile from "@/hooks/useIsMobile";

interface AdaptiveDateRangePickerProps {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AdaptiveDateRangePicker(props: AdaptiveDateRangePickerProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileDateRangePicker {...props} />;
  }
  
  // Adaptar el formato para el DateRangePicker original
  const adaptedProps = {
    date: props.dateRange,
    onDateChange: props.onDateRangeChange,
    placeholder: props.placeholder,
    className: props.className,
    disabled: props.disabled
  };
  
  return <DateRangePicker {...adaptedProps} />;
}