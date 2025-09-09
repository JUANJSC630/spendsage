"use client";

import { useMemo } from "react";
import { YearFilter } from "@/app/(routes)/list-payment-schedule/components/YearFilter";
import { ListPaymentSchedule } from "@prisma/client";
import { useYearContext } from "@/app/(routes)/list-payment-schedule/components/YearContext";

interface FilterYearProps {
  data: ListPaymentSchedule[];
}

export function FilterYear({ data }: FilterYearProps) {
  const { selectedYear, setSelectedYear } = useYearContext();
  
  const availableYears = useMemo(() => {
    const years = data.map((item) => new Date(item.createdAt).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [data]);

  if (availableYears.length === 0) return null;

  return (
    <YearFilter
      availableYears={availableYears}
      selectedYear={selectedYear}
      onYearChange={setSelectedYear}
    />
  );
}
