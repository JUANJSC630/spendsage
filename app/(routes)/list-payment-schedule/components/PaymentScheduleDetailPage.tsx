"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ButtonAddPaymentSchedule } from "./ButtonAddPaymentSchedule/ButtonAddPaymentSchedule";
import { CardPaymentSchedule } from "./CardPaymentSchedule";
import { useListPaymentSchedule } from "@/hooks/use-payment-schedules";

interface PaymentScheduleDetailPageProps {
  listPaymentId: string;
}

export function PaymentScheduleDetailPage({ listPaymentId }: PaymentScheduleDetailPageProps) {
  const { data: listPaymentSchedule, isLoading, error } = useListPaymentSchedule(listPaymentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !listPaymentSchedule) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-slate-500 mb-4">Lista de pagos no encontrada.</p>
        <Link href="/list-payment-schedule">
          <Button variant="outline" size="sm">Volver</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto py-6 px-4 gap-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="mb-1">
            <Link href="/list-payment-schedule" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {listPaymentSchedule.name}
          </h1>
        </div>
        
        <div>
          <ButtonAddPaymentSchedule
            listPaymentScheduleId={listPaymentSchedule.id}
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 items-start">
        {listPaymentSchedule.paymentSchedules.length > 0 ? (
          listPaymentSchedule.paymentSchedules.map((paymentSchedule) => (
            <CardPaymentSchedule
              key={paymentSchedule.id}
              paymentSchedule={paymentSchedule}
            />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-400 text-sm">
            No hay sub-listas de pagos. Usa el botón "Agregar" para crear una.
          </div>
        )}
      </div>
    </div>
  );
}