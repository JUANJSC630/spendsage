"use client";

import { ButtonAddListPaymentSchedule } from "./ButtonAddListPaymentSchedule";
import { FilterYear } from "./FilterYear";
import { YearProvider } from "./YearContext";
import { Content } from "./Content";
import { useListPaymentSchedules } from "@/hooks/use-payment-schedules";
import { Loader2 } from "lucide-react";

export function ListPaymentSchedulePage() {
  const { data = [], isLoading, error } = useListPaymentSchedules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">No se pudieron cargar las listas de pagos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-8">
      <YearProvider data={data}>
        {/* Header con filtro y botón */}
        <div className="bg-background py-4 px-6 mb-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 md:gap-8">
            <h1 className="text-2xl font-bold">Listas de Pagos</h1>
            <div className="flex flex-wrap w-full sm:w-auto items-center gap-2 sm:gap-4">
              <FilterYear data={data} />
              <ButtonAddListPaymentSchedule />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="container mx-auto">
          <Content data={data} />
        </div>
      </YearProvider>
    </div>
  );
}