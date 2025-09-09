"use client";

import Link from "next/link";
import CardList from "@/app/(routes)/list-payment-schedule/components/CardList";
import { ListPaymentSchedule } from "@prisma/client";
import { useYearContext } from "@/app/(routes)/list-payment-schedule/components/YearContext";

interface ContentProps {
  data: ListPaymentSchedule[];
}

export function Content({ data }: ContentProps) {
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
}
