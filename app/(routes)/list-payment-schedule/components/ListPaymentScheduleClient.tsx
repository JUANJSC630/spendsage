"use client";

import { useMemo } from "react";
import { ListPaymentSchedule } from "@prisma/client";
import Link from "next/link";
import { YearProvider, useYearContext } from "@/app/(routes)/list-payment-schedule/components/YearContext";
import { Content } from "@/app/(routes)/list-payment-schedule/components/Content";
import { YearFilter } from "@/app/(routes)/list-payment-schedule/components/YearFilter";
import CardList from "@/app/(routes)/list-payment-schedule/components/CardList";

interface ListPaymentScheduleClientProps {
  data: ListPaymentSchedule[];
}

export function ListPaymentScheduleClient({ data }: ListPaymentScheduleClientProps) {
  return (
    <YearProvider data={data}>
      <Content data={data} />
    </YearProvider>
  );
}

ListPaymentScheduleClient.Filter = function Filter({ data }: ListPaymentScheduleClientProps) {
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
};

ListPaymentScheduleClient.Content = function Content({ data }: ListPaymentScheduleClientProps) {
  const { filteredData, selectedYear } = useYearContext();

  return (
    <div className="flex-wrap flex flex-row justify-center gap-8">
      {filteredData.map((listPaymentSchedule) => (
        <Link
          key={listPaymentSchedule.id}
          href={`/list-payment-schedule/${listPaymentSchedule.id}`}
        >
          <CardList listPaymentScheduleName={listPaymentSchedule.name} />
        </Link>
      ))}

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-400">
            {selectedYear 
              ? `No payment schedules found for ${selectedYear}...`
              : "No payment schedules yet...."
            }
          </h1>
        </div>
      ) : null}
    </div>
  );
};