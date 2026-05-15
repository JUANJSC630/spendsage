"use client";

import { ListPaymentItemsProps } from "./ListPaymentItemsProps.types";
import PaymentScheduleItem from "../PaymentScheduleItem/PaymentScheduleItem";
import { PaymentTotals } from "../PaymentTotals/PaymentTotals";
import { usePaymentItems } from "@/hooks/use-payment-schedules";
import { Loader2 } from "lucide-react";

export default function ListPaymentItems(props: ListPaymentItemsProps) {
  const { paymentSchedule } = props;

  const { data: items = [], isLoading, error } = usePaymentItems(paymentSchedule.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar los items de pago
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col flex-1">
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm">No hay pagos registrados</p>
        </div>
      ) : (
        <div className="flex flex-col overscroll-y-contain overflow-auto max-h-[350px] pr-1">
          {items.map((paymentItem) => (
            <PaymentScheduleItem
              paymentItem={paymentItem}
              paymentSchedule={paymentSchedule}
              key={paymentItem.id}
            />
          ))}
        </div>
      )}
      
      <div className="mt-auto pt-2">
        <PaymentTotals items={items} />
      </div>
    </div>
  );
}
