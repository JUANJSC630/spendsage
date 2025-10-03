"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import ButtonDeletePaymentItem from "../ButtonDeletePaymentItem/ButtonDeletePaymentItem";
import { CheckBoxUpdatePaymentItem } from "../CheckBoxUpdatePaymentItem/CheckBoxUpdatePaymentItem";
import { PaymentScheduleItemProps } from "./PaymentScheduleItem.types";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import EditPaymentItem from "../EditPaymentItem";
import { useUpdatePaymentItem } from "@/hooks/use-payment-schedules";

export default function PaymentScheduleItem(props: PaymentScheduleItemProps) {
  const { paymentItem, paymentSchedule } = props;
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
    event: React.ChangeEvent<HTMLInputElement>
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
    <div className="flex justify-between items-center bg-slate-50 p-2">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex items-center space-x-4">
        <CheckBoxUpdatePaymentItem
          checked={checked}
          onChange={handleCheckboxChange}
        />
        <div className="flex flex-col">
          <div className="text-gray-500">{paymentItem.description}</div>
          <div className="font-semibold">
            {symbol}

            {new Intl.NumberFormat("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(parseFloat(paymentItem.amount))}
          </div>
          <div className="text-gray-500 text-xs">
            {new Date(paymentItem.date).toLocaleDateString("es-ES")}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
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
