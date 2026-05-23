"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { MobileDatePicker } from "@/components/ui/react-datepicker";
import useIsMobile from "@/hooks/useIsMobile";

interface AdaptiveDatePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AdaptiveDatePicker(props: AdaptiveDatePickerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDatePicker {...props} />;
  }

  return (
    <DatePicker
      date={props.date ?? undefined}
      onDateChange={(d) => props.onDateChange(d ?? null)}
      placeholder={props.placeholder}
      className={props.className}
      disabled={props.disabled}
    />
  );
}
