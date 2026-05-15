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
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredData.map((listPaymentSchedule) => (
          <CardListWithActions
            key={listPaymentSchedule.id}
            listPaymentSchedule={listPaymentSchedule}
          />
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
}
