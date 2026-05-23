"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import ButtonDeletePaymentItem from "../ButtonDeletePaymentItem/ButtonDeletePaymentItem";
import { CheckBoxUpdatePaymentItem } from "../CheckBoxUpdatePaymentItem/CheckBoxUpdatePaymentItem";
import { PaymentScheduleItemProps } from "./PaymentScheduleItem.types";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import EditPaymentItem from "../EditPaymentItem";
import { useUpdatePaymentItem } from "@/hooks/use-payment-schedules";
import { cn } from "@/lib/utils";

export default function PaymentScheduleItem(props: PaymentScheduleItemProps) {
  const { paymentSchedule, paymentItem } = props;
  const { getSymbol } = useCurrencyStore();
  const [checked, setChecked] = useState(paymentItem.check);
  const [symbol, setSymbol] = useState<string>("");

  const updatePaymentItemMutation = useUpdatePaymentItem();

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);

  useEffect(() => {
    setChecked(paymentItem.check);
  }, [paymentItem.check]);

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newCheckedState = event.target.checked;
    setChecked(newCheckedState);

    try {
      await updatePaymentItemMutation.mutateAsync({
        id: paymentItem.id,
        paymentScheduleId: paymentSchedule.id,
        check: newCheckedState,
      });
      toast.success("¡Pago actualizado exitosamente! ✅");
    } catch (error) {
      console.error("Error updating checkbox:", error);
      setChecked(!newCheckedState);
      toast.error("Error al actualizar pago");
    }
  };
  return (
    <div
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center justify-between py-3 px-2 sm:py-2 sm:px-1 border-b border-slate-100 last:border-0 transition-colors gap-2 sm:gap-0",
        checked ? "opacity-60" : "hover:bg-slate-50/50",
      )}
    >
      <div className="flex items-start sm:items-center space-x-3 flex-1 overflow-hidden w-full">
        <div className="mt-0.5 sm:mt-0 shrink-0">
          <CheckBoxUpdatePaymentItem
            checked={checked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
            <span
              className={cn(
                "text-sm font-medium text-slate-800 break-words line-clamp-2 sm:truncate transition-all",
                checked && "text-slate-500 line-through",
              )}
            >
              {paymentItem.description}
            </span>
            <span
              className={cn(
                "text-sm font-semibold flex items-center shrink-0",
                checked ? "text-slate-500" : "text-slate-900",
              )}
            >
              <span className="mr-0.5 text-slate-400 font-normal">
                {symbol}
              </span>
              {new Intl.NumberFormat("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(parseFloat(paymentItem.amount))}
            </span>
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            {new Date(paymentItem.date).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 self-end sm:self-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:ml-2">
        <EditPaymentItem
          paymentItem={paymentItem}
          paymentSchedule={paymentSchedule}
        />
        <ButtonDeletePaymentItem
          paymentSchedule={paymentSchedule}
          paymentItem={paymentItem}
        />
      </div>
    </div>
  );
}
