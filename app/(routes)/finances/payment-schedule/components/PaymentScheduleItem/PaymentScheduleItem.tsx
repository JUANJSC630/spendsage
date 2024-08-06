"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import ButtonDeletePaymentItem from "../ButtonDeletePaymentItem/ButtonDeletePaymentItem";
import { CheckBoxUpdatePaymentItem } from "../CheckBoxUpdatePaymentItem/CheckBoxUpdatePaymentItem";
import { PaymentScheduleItemProps } from "./PaymentScheduleItem.types";

export default function PaymentScheduleItem(props: PaymentScheduleItemProps) {
  const { paymentItem, paymentSchedule } = props;
  const [checked, setChecked] = useState(paymentItem.check);

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
      toast.success("Payment updated successfully ✅");
      router.refresh();
    } catch (error) {
      console.error("Error updating checkbox:", error);
      setChecked(!newCheckedState);
      toast.error("Error to update payment");
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
          <div className="font-semibold">${paymentItem.amount}</div>
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
