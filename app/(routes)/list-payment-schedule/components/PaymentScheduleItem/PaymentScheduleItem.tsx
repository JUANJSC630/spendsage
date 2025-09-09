"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import ButtonDeletePaymentItem from "../ButtonDeletePaymentItem/ButtonDeletePaymentItem";
import { CheckBoxUpdatePaymentItem } from "../CheckBoxUpdatePaymentItem/CheckBoxUpdatePaymentItem";
import { PaymentScheduleItemProps } from "./PaymentScheduleItem.types";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export default function PaymentScheduleItem(props: PaymentScheduleItemProps) {
  const { paymentItem, paymentSchedule } = props;
  const { getSymbol } = useCurrencyStore();
  const [checked, setChecked] = useState(paymentItem.check);

  const [symbol, setSymbol] = useState<string>(""); // Nuevo estado para manejar el símbolo de la moneda

  useEffect(() => {
    // Actualiza el símbolo después de la hidratación
    setSymbol(getSymbol());
  }, [getSymbol]);

  const router = useRouter();

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCheckedState = event.target.checked;
    setChecked(newCheckedState);
    try {
      const { data } = await axios.patch(
        `/api/payment-schedule/${paymentSchedule.id}/payment-item/${paymentItem.id}`,
        {
          check: newCheckedState,
        }
      );
      setChecked(data.check);
      toast.success("¡Pago actualizado exitosamente! ✅");
      router.refresh();
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
      <ButtonDeletePaymentItem
        paymentSchedule={paymentSchedule}
        paymentItem={paymentItem}
      />
    </div>
  );
}
