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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !listPaymentSchedule) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-400">
          Lista de pagos no encontrada.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-8">
      <h1 className="text-3xl font-bold mb-4">{listPaymentSchedule.name}</h1>

      <div className="w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-2 md:gap-8">
        {/* Botón de retroceso */}
        <Link href="/list-payment-schedule">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>

        <ButtonAddPaymentSchedule
          listPaymentScheduleId={listPaymentSchedule.id}
        />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {listPaymentSchedule.paymentSchedules.length > 0 ? (
          listPaymentSchedule.paymentSchedules.map((paymentSchedule) => (
            <CardPaymentSchedule
              key={paymentSchedule.id}
              paymentSchedule={paymentSchedule}
            />
          ))
        ) : (
          <p className="text-gray-400">No se encontraron listas de pagos.</p>
        )}
      </div>
    </div>
  );
}