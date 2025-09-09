"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearFilterProps {
  availableYears: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export function YearFilter({ availableYears, selectedYear, onYearChange }: YearFilterProps) {
  const currentYear = new Date().getFullYear();
  const defaultValue = selectedYear?.toString() || currentYear.toString();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={defaultValue}
        onValueChange={(value) => onYearChange(value === "all" ? null : parseInt(value))}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder={currentYear.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All years</SelectItem>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}