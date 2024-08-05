"use client";
import axios from "axios";
import { Trash, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast, Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { PaymentScheduleItemProps } from "./PaymentScheduleItem.types";
import ButtonDeletePaymentItem from "../ButtonDeletePaymentItem/ButtonDeletePaymentItem";

export default function PaymentScheduleItem(props: PaymentScheduleItemProps) {
  const { paymentItem, paymentSchedule } = props;

  return (
    <div className="flex justify-between items-center bg-slate-50 p-2">
      <div className="flex items-center space-x-4">
        <Toaster position="top-right" reverseOrder={true} />
        <Checkbox checked={paymentItem.check} />
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
