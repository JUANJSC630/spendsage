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
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredData.map((listPaymentSchedule) => (
          <Link
            key={listPaymentSchedule.id}
            href={`/list-payment-schedule/${listPaymentSchedule.id}`}
            className="block w-full"
          >
            <CardList listPaymentScheduleName={listPaymentSchedule.name} />
          </Link>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-8">
          <h1 className="text-2xl font-bold text-slate-500">
            {selectedYear 
              ? `No se encontraron listas para ${selectedYear}`
              : "Aún no tienes listas de pagos"
            }
          </h1>
          <p className="text-slate-400">Comienza creando tu primera lista de pagos arriba.</p>
        </div>
      ) : null}
    </div>
  );
};