"use client";

import { ListPaymentSchedule } from "@prisma/client";
import { useYearContext } from "@/app/(routes)/list-payment-schedule/components/YearContext";
import { CardListWithActions } from "./CardListWithActions";

interface ContentProps {
  data: ListPaymentSchedule[];
}

export function Content({ data }: ContentProps) {
  const { filteredData, selectedYear } = useYearContext();

  return (
    <div className="flex-wrap flex flex-row justify-center gap-8">
      {filteredData.map((listPaymentSchedule) => (
        <CardListWithActions
          key={listPaymentSchedule.id}
          listPaymentSchedule={listPaymentSchedule}
        />
      ))}

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-400">
            {selectedYear
              ? `No se encontraron listas de pagos para ${selectedYear}...`
              : "Aún no hay listas de pagos..."
            }
          </h1>
        </div>
      ) : null}
    </div>
  );
}
