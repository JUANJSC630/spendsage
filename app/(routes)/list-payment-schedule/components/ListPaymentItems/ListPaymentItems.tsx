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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 overscroll-y-contain overflow-auto max-h-[350px]">
        {items.map((paymentItem) => (
          <PaymentScheduleItem
            paymentItem={paymentItem}
            paymentSchedule={paymentSchedule}
            key={paymentItem.id}
          />
        ))}
      </div>
      <PaymentTotals items={items} />
    </div>
  );
}
