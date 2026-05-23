"use client";

import { ButtonAddListPaymentSchedule } from "./ButtonAddListPaymentSchedule";
import { FilterYear } from "./FilterYear";
import { YearProvider } from "./YearContext";
import { Content } from "./Content";
import { useListPaymentSchedules } from "@/hooks/use-payment-schedules";

function PageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b border-slate-100 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="h-7 w-44 bg-slate-200 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 pt-6">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListPaymentSchedulePage() {
  const { data = [], isLoading, error } = useListPaymentSchedules();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">
            No se pudieron cargar las listas de pagos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <YearProvider data={data}>
        {/* Header sticky en mobile */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 sm:relative sm:top-auto sm:bg-transparent sm:backdrop-blur-none sm:border-0">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 shrink-0">
              Listas de Pagos
            </h1>
            <div className="flex items-center gap-2">
              <FilterYear data={data} />
              <ButtonAddListPaymentSchedule />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="container mx-auto px-4 sm:px-6 pb-8 pt-4 sm:pt-6">
          <Content data={data} />
        </div>
      </YearProvider>
    </div>
  );
}
