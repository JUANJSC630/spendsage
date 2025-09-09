"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { ListPaymentSchedule } from "@prisma/client";

interface YearContextType {
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  filteredData: ListPaymentSchedule[];
}

const YearContext = createContext<YearContextType | null>(null);

export function useYearContext() {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useYearContext must be used within a YearProvider");
  }
  return context;
}

interface YearProviderProps {
  children: ReactNode;
  data: ListPaymentSchedule[];
}

export function YearProvider({ children, data }: YearProviderProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    if (!selectedYear) return data;
    
    return data.filter((item) => {
      const itemYear = new Date(item.createdAt).getFullYear();
      return itemYear === selectedYear;
    });
  }, [data, selectedYear]);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, filteredData }}>
      {children}
    </YearContext.Provider>
  );
}
